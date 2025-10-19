export default function Donate() {
  const handleCheckout = () => {
    window.location.href =
      "https://buy.stripe.com/test_bJe7sK83ifEtakJahn7AI00";
  };

  return (
    <button
      onClick={handleCheckout}
      style={{ padding: "10px", fontSize: "16px" }}
    >
      Donate
    </button>
  );
}
