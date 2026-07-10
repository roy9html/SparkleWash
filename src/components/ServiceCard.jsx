function ServiceCard({ title, description, price }) {
  return (
    <div>
      <h3>{title}</h3>

      <p>{description}</p>

      <h4>{price}</h4>

      <button>Book Service</button>
    </div>
  );
}

export default ServiceCard;