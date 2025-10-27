import { Card, Button, Input } from "@power/ui";

export default function NewAssignmentPage() {
  return (
    <div className="space-y-6">
      <Card title="Assigner un programme" description="Sélectionnez un athlète et un programme.">
        <form className="grid gap-4 md:grid-cols-2">
          <Input label="Athlète" name="athlete" placeholder="Rechercher..." />
          <Input label="Programme" name="program" placeholder="Sélectionner..." />
          <Input label="Date de début" type="date" name="startDate" />
          <Input label="Date de fin" type="date" name="endDate" />
          <div className="md:col-span-2">
            <Button type="submit">Créer l’assignation</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
