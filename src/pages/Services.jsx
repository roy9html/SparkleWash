import ServiceCard from "../components/ServiceCard";

function Services() {
  const services = [
    {
      id: 1,
      title: "Basic Wash",
      description: "Exterior wash",
      price: "KES 500",
    },
    {
      id: 2,
      title: "Interior Cleaning",
      description: "Complete interior cleaning",
      price: "KES 800",
    },
    {
      id: 3,
      title: "Premium Wash",
      description: "Interior and exterior",
      price: "KES 1200",
    },
    {
      id: 4,
      title: "Full Detailing",
      description: "Complete detailing package",
      price: "KES 2500",
    },
  ];

  return (
    <section>
      <h1>Our Services</h1>

      {services.map((service) => (
        <ServiceCard
          key={service.id}
          title={service.title}
          description={service.description}
          price={service.price}
        />
      ))}
    </section>
  );
}

export default Services;