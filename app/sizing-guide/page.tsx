import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Sizing Guide",
  description: "A size reference for Lion Leather footwear.",
};

// Approximate men's conversions — a guide, not an exact standard.
const SIZES: { uk: string; eu: string; us: string; cm: string }[] = [
  { uk: "6", eu: "40", us: "7", cm: "24.5" },
  { uk: "7", eu: "41", us: "8", cm: "25.5" },
  { uk: "8", eu: "42", us: "9", cm: "26.0" },
  { uk: "9", eu: "43", us: "10", cm: "27.0" },
  { uk: "10", eu: "44", us: "11", cm: "28.0" },
  { uk: "11", eu: "45", us: "12", cm: "29.0" },
  { uk: "12", eu: "46", us: "13", cm: "30.0" },
];

export default function SizingGuidePage() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <Eyebrow>Guidance</Eyebrow>
        <Heading as="h1" className="mt-6">
          Finding your size.
        </Heading>

        <p className="mt-12 text-body font-light text-taupe">
          Our footwear is built on a true-to-size last. If you are between
          sizes, or favour a heavier sock, we suggest taking the larger of the
          two. To measure, stand on a sheet of paper and mark heel to longest
          toe — the length in centimetres maps to the chart below.
        </p>

        <table className="mt-14 w-full border-collapse text-left">
          <thead>
            <tr className="border-y border-gold/30">
              {["UK", "EU", "US", "Foot length"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="py-4 text-eyebrow font-normal uppercase text-ink"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-body font-light text-taupe">
            {SIZES.map((row) => (
              <tr key={row.uk} className="border-b border-gold/30">
                <td className="py-4">{row.uk}</td>
                <td className="py-4">{row.eu}</td>
                <td className="py-4">{row.us}</td>
                <td className="py-4">{row.cm} cm</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-10 text-caption font-light text-taupe">
          Conversions are approximate and offered as guidance. For help with a
          particular style, write to us and we will gladly advise.
        </p>

        <Divider className="mt-16" />
      </div>
    </Section>
  );
}
