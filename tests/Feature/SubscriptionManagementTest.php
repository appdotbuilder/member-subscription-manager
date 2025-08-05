<?php

namespace Tests\Feature;

use App\Models\Membership;
use App\Models\SubscriptionPackage;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class SubscriptionManagementTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create test users
        $this->admin = User::factory()->admin()->create();
        $this->member = User::factory()->member()->create();
        
        // Create test subscription packages
        $this->package = SubscriptionPackage::factory()->active()->create();
    }

    public function test_welcome_page_displays_subscription_features()
    {
        $response = $this->get('/');
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('welcome')
        );
    }

    public function test_member_can_view_dashboard()
    {
        $response = $this->actingAs($this->member)
            ->get('/dashboard');
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('dashboard')
                ->has('available_packages')
                ->has('membership_history')
                ->has('transaction_history')
        );
    }

    public function test_admin_can_view_admin_dashboard()
    {
        $response = $this->actingAs($this->admin)
            ->get('/dashboard');
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('admin/dashboard')
                ->has('stats')
                ->has('recent_transactions')
                ->has('recent_memberships')
        );
    }

    public function test_admin_can_create_subscription_package()
    {
        $packageData = [
            'name' => 'Test Package',
            'description' => 'A test subscription package',
            'duration_months' => 3,
            'price' => 150000,
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)
            ->post('/subscription-packages', $packageData);

        $response->assertRedirect('/subscription-packages');
        
        $this->assertDatabaseHas('subscription_packages', [
            'name' => 'Test Package',
            'price' => 150000,
        ]);
    }

    public function test_member_cannot_create_subscription_package()
    {
        $packageData = [
            'name' => 'Test Package',
            'description' => 'A test subscription package',
            'duration_months' => 3,
            'price' => 150000,
            'is_active' => true,
        ];

        $response = $this->actingAs($this->member)
            ->post('/subscription-packages', $packageData);

        $response->assertStatus(403);
    }

    public function test_member_can_view_payment_page()
    {
        $response = $this->actingAs($this->member)
            ->get("/payment/{$this->package->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('payment/index')
                ->has('package')
                ->has('snapToken')
        );
    }

    public function test_member_can_initiate_payment()
    {
        $response = $this->actingAs($this->member)
            ->post('/payment', [
                'subscription_package_id' => $this->package->id
            ]);

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('payment/index')
                ->has('transaction')
        );

        $this->assertDatabaseHas('transactions', [
            'user_id' => $this->member->id,
            'subscription_package_id' => $this->package->id,
            'status' => 'pending',
        ]);
    }

    public function test_member_can_view_memberships()
    {
        // Create a membership for the member
        $membership = Membership::factory()->create([
            'user_id' => $this->member->id,
            'subscription_package_id' => $this->package->id,
        ]);

        $response = $this->actingAs($this->member)
            ->get('/memberships');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('memberships/index')
                ->has('memberships')
        );
    }

    public function test_admin_can_view_all_memberships()
    {
        // Create memberships for different users
        $membership1 = Membership::factory()->create([
            'user_id' => $this->member->id,
            'subscription_package_id' => $this->package->id,
        ]);

        $member2 = User::factory()->member()->create();
        $membership2 = Membership::factory()->create([
            'user_id' => $member2->id,
            'subscription_package_id' => $this->package->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->get('/memberships');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('memberships/index')
                ->has('memberships')
        );
    }

    public function test_subscription_package_model_relationships()
    {
        $package = SubscriptionPackage::factory()->create();
        $membership = Membership::factory()->create([
            'subscription_package_id' => $package->id
        ]);
        $transaction = Transaction::factory()->create([
            'subscription_package_id' => $package->id
        ]);

        $this->assertTrue($package->memberships->contains($membership));
        $this->assertTrue($package->transactions->contains($transaction));
    }

    public function test_user_model_relationships()
    {
        $user = User::factory()->member()->create();
        $membership = Membership::factory()->create(['user_id' => $user->id]);
        $transaction = Transaction::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($user->memberships->contains($membership));
        $this->assertTrue($user->transactions->contains($transaction));
        $this->assertTrue($user->isMember());
        $this->assertFalse($user->isAdmin());
    }

    public function test_membership_model_relationships()
    {
        $membership = Membership::factory()->create();

        $this->assertInstanceOf(User::class, $membership->user);
        $this->assertInstanceOf(SubscriptionPackage::class, $membership->subscriptionPackage);
    }

    public function test_transaction_model_relationships()
    {
        $transaction = Transaction::factory()->create();

        $this->assertInstanceOf(User::class, $transaction->user);
        $this->assertInstanceOf(SubscriptionPackage::class, $transaction->subscriptionPackage);
    }
}