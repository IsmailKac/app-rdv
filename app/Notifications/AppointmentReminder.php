<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Carbon\Carbon;

class AppointmentReminder extends Notification
{
    use Queueable;

    protected $appointment;

    /**
     * Create a new notification instance.
     */
    public function __construct($appointment)
    {
        $this->appointment = $appointment;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $time = Carbon::parse($this->appointment->slot->start_time)->format('H:i');
        $date = Carbon::parse($this->appointment->slot->start_time)->format('d/m/Y');

        return (new MailMessage)
            ->subject('Rappel de rendez-vous - Sigrem')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Ceci est un rappel pour votre rendez-vous prévu pour demain.')
            ->line('Détails du rendez-vous :')
            ->line('Date : ' . $date)
            ->line('Heure : ' . $time)
            ->line('Médecin : Dr. ' . ($this->appointment->slot->doctor->user->name ?? ''))
            ->action('Voir mes rendez-vous', url('/dashboard'))
            ->line('Merci d\'utiliser Sigrem !');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        $time = Carbon::parse($this->appointment->slot->start_time)->format('H:i');
        return [
            'appointment_id' => $this->appointment->id,
            'message' => "Rappel : Votre rendez-vous avec le Dr. " . ($this->appointment->slot->doctor->user->name ?? '') . " est prévu pour demain à " . $time . ".",
            'type' => 'reminder'
        ];
    }
}
