import parse, { attributesToProps, domToReact, Element, type DOMNode, type HTMLReactParserOptions } from "html-react-parser";
import { AnimationWrapper, type AnimationEffect } from "@/components/animations/AnimationWrapper";
import { GoogleMapSection } from "@/components/dynamic/GoogleMapSection";
import { Hero } from "@/components/home/Hero";
import { ContactLayout } from "@/components/sections/ContactLayout";
import { TransitionLink } from "@/components/transitions/TransitionLink";
import { getImageUrl, getSettings } from "@/lib/api";
import { GRAPES_SCOPE_CLASS, parseHeroSlides, prepareGrapesCss, toContactContent } from "@/lib/grapesContent";

interface GrapesPageProps {
  html: string;
  css: string;
}

export async function GrapesPage({ html, css }: GrapesPageProps) {
  const settings = await getSettings();

  const options: HTMLReactParserOptions = {
    replace(node) {
      if (!(node instanceof Element)) {
        return undefined;
      }

      const { attribs, children, name } = node;

      switch (attribs["data-dynamic"]) {
        case "hero-slider":
          return <Hero content={{ slides: parseHeroSlides(attribs["data-slides"]) }} />;
        case "contact":
          return <ContactLayout content={toContactContent(settings)} />;
        case "map":
          return <GoogleMapSection content={{ embedUrl: settings.contact.googleMapsEmbed ?? "" }} />;
      }

      const content = () => domToReact(children as DOMNode[], options);

      if (attribs["data-animate"]) {
        const { "data-animate": effect, ...rest } = attribs;
        const Tag = name as "div";

        return (
          <AnimationWrapper effect={effect as AnimationEffect}>
            <Tag {...attributesToProps(rest)}>{content()}</Tag>
          </AnimationWrapper>
        );
      }

      if (name === "img" && attribs.src?.startsWith("/images/")) {
        const { alt, ...props } = attributesToProps(attribs);
        // Les dimensions sont pilotées par le CSS de GrapesJS, inconnues de next/image.
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} alt={String(alt ?? "")} src={getImageUrl(attribs.src) ?? attribs.src} />;
      }

      if (name === "a" && attribs.href?.startsWith("/")) {
        return (
          <TransitionLink href={attribs.href} id={attribs.id} className={attribs.class} target={attribs.target as "_blank" | undefined} rel={attribs.rel}>
            {content()}
          </TransitionLink>
        );
      }

      return undefined;
    },
  };

  return (
    <div className={GRAPES_SCOPE_CLASS}>
      <style dangerouslySetInnerHTML={{ __html: prepareGrapesCss(css) }} />
      {parse(html, options)}
    </div>
  );
}
