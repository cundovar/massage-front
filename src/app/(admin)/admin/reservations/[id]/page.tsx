interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminReservationDetails({ params }: Props) {
  const { id } = await params;
  return <section className="bo-card p-6">Reservation: {id}</section>;
}
