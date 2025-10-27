import { stripe } from "../../lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@power/db";
import { Card, Button } from "@power/ui";

export default async function BillingPage() {
  const user = await currentUser();
  const org = await prisma.org.findFirst({
    where: {
      owner: {
        clerkUserId: user?.id ?? ""
      }
    },
    include: { subscriptions: true }
  });

  const subscription = org?.subscriptions?.[0];
  const portalUrl = org?.stripeCustomerId && process.env.STRIPE_SECRET_KEY
    ? await stripe.billingPortal.sessions
        .create({
          customer: org.stripeCustomerId,
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/coach/billing`
        })
        .then((session) => session.url)
    : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Facturation</h1>
        <p className="text-slate-500">Gérez votre abonnement coach Power.</p>
      </div>
      <Card title="Statut de l'abonnement">
        <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-500">Statut</dt>
            <dd className="text-lg font-medium text-slate-900">{subscription?.status ?? "Aucun"}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Renouvellement</dt>
            <dd className="text-lg font-medium text-slate-900">
              {subscription?.currentPeriodEnd?.toLocaleDateString("fr-FR") ?? "-"}
            </dd>
          </div>
        </dl>
        {portalUrl && (
          <Button asChild className="mt-6">
            <a href={portalUrl}>Ouvrir le portail client</a>
          </Button>
        )}
      </Card>
    </div>
  );
}
