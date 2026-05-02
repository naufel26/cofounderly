<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasRoles, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'tagline',
        'role',
        'looking_for',
        'stage',
        'interests',
        'avatar',
        'cover_photo',
        'onboarding_completed_at',
        'location',
        'linkedin_url',
        'website',
        'bio',
        'professional_summary',
        'business_stage',
        'skills',
        'experience',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'onboarding_completed_at' => 'datetime',
        'password' => 'hashed',
        'looking_for' => 'array',
        'interests' => 'array',
        'skills' => 'array',
        'experience' => 'array',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    protected $appends = ['profile_photo_url', 'cover_photo_url'];

    protected function profilePhotoUrl(): Attribute
    {
        return Attribute::get(function () {
            return $this->avatar
                ? Storage::disk('public')->url($this->avatar)
                : 'https://ui-avatars.com/api/?name='.urlencode($this->name).'&color=2DAB94&background=E6F6F4';
        });
    }

    protected function coverPhotoUrl(): Attribute
    {
        return Attribute::get(function () {
            return $this->cover_photo
                ? Storage::disk('public')->url($this->cover_photo)
                : null;
        });
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class)->latest();
    }

    public function sentConnections(): HasMany
    {
        return $this->hasMany(Connection::class, 'sender_id');
    }

    public function receivedConnections(): HasMany
    {
        return $this->hasMany(Connection::class, 'receiver_id');
    }

    /**
     * Scope to exclude users the given user has any connection with (any status).
     */
    public function statuses(): HasMany
    {
        return $this->hasMany(Status::class);
    }

    public function activeStatus(): HasOne
    {
        return $this->hasOne(Status::class)->where('expires_at', '>', now())->latestOfMany();
    }

    public function conversations(): BelongsToMany
    {
        return $this->belongsToMany(Conversation::class);
    }

    public function scopeWithoutConnectionTo(Builder $query, int $userId): Builder
    {
        return $query
            ->whereNotIn('id', Connection::select('receiver_id')->where('sender_id', $userId))
            ->whereNotIn('id', Connection::select('sender_id')->where('receiver_id', $userId));
    }
}
