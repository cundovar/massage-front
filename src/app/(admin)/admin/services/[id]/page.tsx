interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminServiceEditor({ params }: Props) {
  const { id } = await params;
  return <section className="bo-card p-6">Edition service: {id}</section>;
}
