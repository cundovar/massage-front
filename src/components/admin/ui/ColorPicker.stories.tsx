import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ColorPicker } from "./ColorPicker";

const meta: Meta<typeof ColorPicker> = {
  title: "UI/Admin/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: { default: "admin" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function ColorPickerDemo() {
  const [color, setColor] = useState("#D4A574");

  return (
    <div className="space-y-3">
      <ColorPicker value={color} onChange={setColor} />
      <p className="text-sm text-stone-600">Couleur selectionnee: <span className="font-mono">{color}</span></p>
    </div>
  );
}

export const Default: Story = {
  render: () => <ColorPickerDemo />,
};
