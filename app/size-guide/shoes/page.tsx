import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Shoe Size Guide",
  description: "EU, UK and US shoe sizes with foot length in centimetres.",
};

// NOTE: these numbers are generic men's conversions, not measurements of our
// own lasts. Check them against real stock before launch.
const SIZES: { eu: string; uk: string; us: string; cm: string }[] = [
  { eu: "40", uk: "6", us: "7", cm: "24.5" },
  { eu: "41", uk: "7", us: "8", cm: "25.5" },
  { eu: "42", uk: "8", us: "9", cm: "26.0" },
  { eu: "43", uk: "9", us: "10", cm: "27.0" },
  { eu: "44", uk: "10", us: "11", cm: "28.0" },
];

export default function ShoeSizeGuidePage() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <Eyebrow>Size guide</Eyebrow>
        <Heading as="h1" className="mt-6">
          Shoe sizes.
        </Heading>

        <p className="mt-12 max-w-[68ch] text-body font-light text-taupe">
          To measure, stand on a sheet of paper and mark heel to longest toe.
          Match the length in centimetres to the chart below. If you are
          between sizes, take the larger of the two.
        </p>

        <table className="mt-14 w-full border-collapse text-left">
          <thead>
            <tr className="border-y border-gold/30">
              {["EU", "UK", "US", "Foot length"].map((h) => (
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
              <tr key={row.eu} className="border-b border-gold/30">
                <td className="py-4">{row.eu}</td>
                <td className="py-4">{row.uk}</td>
                <td className="py-4">{row.us}</td>
                <td className="py-4">{row.cm} cm</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-10 text-sm font-light text-taupe">
          Conversions are approximate and offered as guidance.
        </p>

        <Divider className="mt-16" />
      </div>
    </Section>
  );
}
