import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
    Sentry.init({
        dsn,
        // Ucretsiz kotayi yakmamak icin dusuk tutuluyor; hata olaylari bundan etkilenmez.
        tracesSampleRate: 0.1,
        // "Report an issue" dugmesi: kullanici bize mesaj birakabilsin diye.
        integrations: [
            Sentry.feedbackIntegration({
                colorScheme: 'system',
                showBranding: false,
                triggerLabel: 'Feedback',
                formTitle: 'Send us a message',
                submitButtonLabel: 'Send',
                messagePlaceholder: 'Found a bug, or want to tell us something?',
                isNameRequired: false,
                isEmailRequired: false,
            }),
        ],
    });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
