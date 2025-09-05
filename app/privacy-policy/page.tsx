import { Separator } from '@/components/ui/separator';
import React from 'react';

const Page = () => {
  return (
    <div className="dark:bg-secondary min-h-screen p-10">
      <h1 className="text-foreground mb-4 text-2xl font-bold">
        Privacy Policy
      </h1>
      <Separator className="mb-4" />

      <p className="mb-4">
        Welcome to <strong>PLEIS</strong>. By accessing or using our website or
        services, you agree to be bound by these Terms and Conditions. If you do
        not agree with any part of these terms, you may not use our services.
      </p>

      <h2 className="text-foreground mb-2 text-lg font-semibold">
        1. Account Registration
      </h2>
      <p className="mb-4">
        To access certain features, you may be required to register for an
        account. You agree to provide accurate, complete, and updated
        information and to keep your login credentials secure.
      </p>

      <h2 className="text-foreground mb-2 text-lg font-semibold">
        2. Use of Our Services
      </h2>
      <p className="mb-4">
        You may not use the service for any illegal or unauthorized purpose. You
        agree to comply with all applicable laws and not to interfere or disrupt
        the service or servers.
      </p>

      <h2 className="text-foreground mb-2 text-lg font-semibold">
        3. Subscriptions & Payments
      </h2>
      <p className="mb-4">
        Certain services may require a subscription. By purchasing a
        subscription, you agree to the pricing, billing, and renewal terms set
        forth at the time of purchase.
      </p>

      <h2 className="text-foreground mb-2 text-lg font-semibold">
        4. Intellectual Property
      </h2>
      <p className="mb-4">
        All content, branding, logos, and designs are the intellectual property
        of Pleis and may not be copied or reproduced without permission.
      </p>

      <h2 className="text-foreground mb-2 text-lg font-semibold">
        5. Termination
      </h2>
      <p className="mb-4">
        We reserve the right to terminate or suspend your access to our services
        at any time, with or without notice, for violating these Terms.
      </p>

      <h2 className="text-foreground mb-2 text-lg font-semibold">
        6. Limitation of Liability
      </h2>
      <p className="mb-4">
        Pleis is not liable for any indirect, incidental, or consequential
        damages arising from your use of the services. Use at your own risk.
      </p>

      <h2 className="text-foreground mb-2 text-lg font-semibold">7. Privacy</h2>
      <p className="mb-4">
        Your privacy is important to us. Please review our{' '}
        <a href="/privacy-policy" className="text-primary underline">
          Privacy Policy
        </a>{' '}
        to learn how we handle your personal data.
      </p>

      <h2 className="text-foreground mb-2 text-lg font-semibold">
        8. Updates to Terms
      </h2>
      <p className="mb-4">
        We may modify these Terms at any time. Updates will be posted here, and
        your continued use of the service constitutes acceptance of the new
        Terms.
      </p>

      <p className="text-muted-foreground mt-6 text-xs">
        Last updated: July 10, 2025
      </p>
    </div>
  );
};

export default Page;
