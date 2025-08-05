<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSubscriptionPackageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user() && auth()->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'duration_months' => 'required|integer|min:1|max:120',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Package name is required.',
            'description.required' => 'Package description is required.',
            'duration_months.required' => 'Duration is required.',
            'duration_months.min' => 'Duration must be at least 1 month.',
            'duration_months.max' => 'Duration cannot exceed 120 months.',
            'price.required' => 'Price is required.',
            'price.min' => 'Price must be at least 0.',
        ];
    }
}