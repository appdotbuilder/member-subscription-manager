<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\SubscriptionPackage
 *
 * @property int $id
 * @property string $name
 * @property string $description
 * @property int $duration_months
 * @property float $price
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Membership> $memberships
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Transaction> $transactions
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|SubscriptionPackage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SubscriptionPackage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SubscriptionPackage query()
 * @method static \Illuminate\Database\Eloquent\Builder|SubscriptionPackage whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubscriptionPackage whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubscriptionPackage whereDurationMonths($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubscriptionPackage whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubscriptionPackage whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubscriptionPackage whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubscriptionPackage wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubscriptionPackage whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubscriptionPackage active()
 * @method static \Database\Factories\SubscriptionPackageFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class SubscriptionPackage extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'description',
        'duration_months',
        'price',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'duration_months' => 'integer',
    ];

    /**
     * Scope a query to only include active packages.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the memberships for this package.
     */
    public function memberships(): HasMany
    {
        return $this->hasMany(Membership::class);
    }

    /**
     * Get the transactions for this package.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}