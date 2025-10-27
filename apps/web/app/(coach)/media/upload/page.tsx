import { Button, Card, Input } from "@power/ui";

export default function MediaUploadPage() {
  return (
    <div className="space-y-6">
      <Card title="Uploader une vidéo" description="Générez une URL signée R2 puis envoyez l'asset vers Mux.">
        <form className="space-y-4">
          <Input type="file" accept="video/*" label="Fichier vidéo" />
          <Input label="Titre" name="title" placeholder="Back squat tempo" />
          <Button type="submit">Générer un upload</Button>
        </form>
      </Card>
    </div>
  );
}
