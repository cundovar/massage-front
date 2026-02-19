import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedSection } from "./AnimatedSection";

const meta: Meta<typeof AnimatedSection> = {
  title: "UI/Front/AnimatedSection",
  component: AnimatedSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    delay: { control: { type: "number", min: 0, max: 1000, step: 100 } },
    className: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="rounded bg-white p-8 shadow">
        <h2 className="font-serif text-2xl">Section animee</h2>
        <p className="mt-2 text-gray-600">Cette section apparait au scroll.</p>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="min-h-[150vh] px-8 pt-[80vh]">
        <p className="mb-4 text-gray-400">Scroll pour voir l&apos;animation</p>
        <Story />
      </div>
    ),
  ],
};

export const WithDelay: Story = {
  args: {
    delay: 300,
    children: (
      <div className="rounded bg-white p-8 shadow">
        <h2 className="font-serif text-2xl">Avec delai</h2>
        <p className="mt-2 text-gray-600">Apparait apres 300ms.</p>
      </div>
    ),
  },
};

export const Staggered: Story = {
  render: () => (
    <div className="space-y-4 p-8">
      <AnimatedSection delay={0}>
        <div className="rounded bg-white p-4 shadow">Premier element</div>
      </AnimatedSection>
      <AnimatedSection delay={150}>
        <div className="rounded bg-white p-4 shadow">Deuxieme element</div>
      </AnimatedSection>
      <AnimatedSection delay={300}>
        <div className="rounded bg-white p-4 shadow">Troisieme element</div>
      </AnimatedSection>
    </div>
  ),
  decorators: [
    (Story) => (
      <div className="min-h-[150vh] pt-[60vh]">
        <Story />
      </div>
    ),
  ],
};
