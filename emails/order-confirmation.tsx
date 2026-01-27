import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Hr,
} from "@react-email/components";

interface OrderItem {
  name: string;
  variant: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shippingAddress: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export function OrderConfirmationEmail({
  orderNumber,
  customerName,
  items,
  subtotal,
  discount,
  shipping,
  total,
  shippingAddress,
}: OrderConfirmationEmailProps) {
  const previewText = `Your DuBuBu order #${orderNumber} is confirmed!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>DuBuBu</Text>
            <Text style={tagline}>Where Love Meets Cute</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Thank you for your order!</Heading>
            <Text style={paragraph}>
              Hey {customerName}, your adorable Bubu & Dudu items are being
              prepared with love!
            </Text>

            {/* Order Number */}
            <Section style={orderBox}>
              <Text style={orderLabel}>ORDER NUMBER</Text>
              <Text style={orderNumberStyle}>{orderNumber}</Text>
            </Section>

            {/* Order Items */}
            <Section style={itemsSection}>
              <Text style={sectionTitle}>Order Details</Text>
              {items.map((item, index) => (
                <Row key={index} style={itemRow}>
                  <Column style={{ width: "60px" }}>
                    <Img
                      src={item.image || "https://dububu.com/placeholder.png"}
                      width="50"
                      height="50"
                      alt={item.name}
                      style={itemImage}
                    />
                  </Column>
                  <Column style={itemDetails}>
                    <Text style={itemName}>{item.name}</Text>
                    <Text style={itemVariant}>
                      {item.variant} x {item.quantity}
                    </Text>
                  </Column>
                  <Column style={itemPriceCol}>
                    <Text style={itemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            <Hr style={divider} />

            {/* Order Summary */}
            <Section style={summarySection}>
              <Row style={summaryRow}>
                <Column>
                  <Text style={summaryLabel}>Subtotal</Text>
                </Column>
                <Column style={{ textAlign: "right" as const }}>
                  <Text style={summaryValue}>${subtotal.toFixed(2)}</Text>
                </Column>
              </Row>
              {discount > 0 && (
                <Row style={summaryRow}>
                  <Column>
                    <Text style={discountLabel}>Discount</Text>
                  </Column>
                  <Column style={{ textAlign: "right" as const }}>
                    <Text style={discountValue}>-${discount.toFixed(2)}</Text>
                  </Column>
                </Row>
              )}
              <Row style={summaryRow}>
                <Column>
                  <Text style={summaryLabel}>Shipping</Text>
                </Column>
                <Column style={{ textAlign: "right" as const }}>
                  <Text style={summaryValue}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </Text>
                </Column>
              </Row>
              <Hr style={totalDivider} />
              <Row style={summaryRow}>
                <Column>
                  <Text style={totalLabel}>Total</Text>
                </Column>
                <Column style={{ textAlign: "right" as const }}>
                  <Text style={totalValue}>${total.toFixed(2)}</Text>
                </Column>
              </Row>
            </Section>

            <Hr style={divider} />

            {/* Shipping Address */}
            <Section style={addressSection}>
              <Text style={sectionTitle}>Shipping To</Text>
              <Text style={addressText}>
                {shippingAddress.address1}
                {shippingAddress.address2 && (
                  <>
                    <br />
                    {shippingAddress.address2}
                  </>
                )}
                <br />
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.postalCode}
                <br />
                {shippingAddress.country}
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={ctaSection}>
              <Link
                href={`https://www.dububu.com/track-order?order=${orderNumber}`}
                style={ctaButton}
              >
                Track Your Order
              </Link>
            </Section>

            {/* Delivery Note */}
            <Section style={noteSection}>
              <Text style={noteText}>
                Most orders ship within 3-7 business days. Print-on-demand items
                may take 5-12 business days to produce and ship.
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Questions? Reply to this email or visit our{" "}
              <Link href="https://www.dububu.com/contact" style={footerLink}>
                help center
              </Link>
              .
            </Text>
            <Text style={footerCopy}>
              &copy; {new Date().getFullYear()} DuBuBu. All rights reserved.
            </Text>
            <Text style={disclaimer}>
              This is fan-made merchandise. Not affiliated with the official
              Bubu & Dudu brand.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#fdf2f8",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0",
  maxWidth: "600px",
};

const header = {
  textAlign: "center" as const,
  padding: "24px 0",
};

const logo = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#ec4899",
  margin: "0",
};

const tagline = {
  fontSize: "14px",
  color: "#9ca3af",
  margin: "4px 0 0 0",
};

const content = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "32px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
};

const h1 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 16px 0",
};

const paragraph = {
  color: "#6b7280",
  fontSize: "16px",
  lineHeight: "1.5",
  textAlign: "center" as const,
  margin: "0 0 24px 0",
};

const orderBox = {
  backgroundColor: "#fdf2f8",
  borderRadius: "12px",
  padding: "16px",
  textAlign: "center" as const,
  marginBottom: "24px",
};

const orderLabel = {
  color: "#ec4899",
  fontSize: "12px",
  fontWeight: "600",
  letterSpacing: "1px",
  margin: "0 0 4px 0",
};

const orderNumberStyle = {
  color: "#1f2937",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0",
};

const sectionTitle = {
  color: "#1f2937",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const itemsSection = {
  marginBottom: "24px",
};

const itemRow = {
  borderBottom: "1px solid #f3f4f6",
  padding: "12px 0",
};

const itemImage = {
  borderRadius: "8px",
};

const itemDetails = {
  paddingLeft: "12px",
};

const itemName = {
  color: "#1f2937",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0",
};

const itemVariant = {
  color: "#6b7280",
  fontSize: "12px",
  margin: "4px 0 0 0",
};

const itemPriceCol = {
  textAlign: "right" as const,
};

const itemPrice = {
  color: "#1f2937",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0",
};

const divider = {
  borderTop: "1px solid #f3f4f6",
  margin: "24px 0",
};

const summarySection = {
  marginBottom: "24px",
};

const summaryRow = {
  marginBottom: "8px",
};

const summaryLabel = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0",
};

const summaryValue = {
  color: "#1f2937",
  fontSize: "14px",
  margin: "0",
};

const discountLabel = {
  color: "#10b981",
  fontSize: "14px",
  margin: "0",
};

const discountValue = {
  color: "#10b981",
  fontSize: "14px",
  margin: "0",
};

const totalDivider = {
  borderTop: "2px solid #ec4899",
  margin: "12px 0",
};

const totalLabel = {
  color: "#1f2937",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0",
};

const totalValue = {
  color: "#ec4899",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0",
};

const addressSection = {
  marginBottom: "24px",
};

const addressText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
};

const ctaSection = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const ctaButton = {
  backgroundColor: "#ec4899",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "600",
  padding: "12px 32px",
  textDecoration: "none",
};

const noteSection = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "16px",
};

const noteText = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0",
  textAlign: "center" as const,
};

const footer = {
  textAlign: "center" as const,
  padding: "24px",
};

const footerText = {
  color: "#9ca3af",
  fontSize: "12px",
  margin: "0 0 8px 0",
};

const footerLink = {
  color: "#ec4899",
  textDecoration: "underline",
};

const footerCopy = {
  color: "#9ca3af",
  fontSize: "12px",
  margin: "0 0 8px 0",
};

const disclaimer = {
  color: "#d1d5db",
  fontSize: "10px",
  margin: "0",
};

export default OrderConfirmationEmail;
