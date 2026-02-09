"use client";

import { useState } from "react";
import { MediaPicker } from "@/components/admin/media/MediaPicker";
import { updateSection, type PageSection } from "@/lib/api-admin";

interface SectionEditorProps {
  token: string;
  pageSlug: string;
  section: PageSection;
  onUpdate: (section: PageSection) => void;
}

export function SectionEditor({ token, pageSlug, section, onUpdate }: SectionEditorProps) {
  const [content, setContent] = useState<Record<string, unknown>>(section.content);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function sanitizeContent(raw: Record<string, unknown>): Record<string, unknown> {
    const next = { ...raw };
    if ("slides" in next && Array.isArray(next.slides)) {
      next.slides = (next.slides as Array<Record<string, unknown>>).filter((slide) => {
        const image = slide?.image;
        return typeof image === "string" && image.trim().length > 0;
      });
    }
    if ("images" in next && Array.isArray(next.images)) {
      next.images = (next.images as unknown[]).filter((image) => typeof image === "string" && image.trim().length > 0);
    }
    if ("bullets" in next && Array.isArray(next.bullets)) {
      next.bullets = (next.bullets as unknown[]).filter((bullet) => typeof bullet === "string" && bullet.trim().length > 0);
    }
    if ("offers" in next && Array.isArray(next.offers)) {
      next.offers = (next.offers as Array<Record<string, unknown>>)
        .map((offer) => {
          const prices = Array.isArray(offer.prices)
            ? (offer.prices as unknown[]).filter((price) => typeof price === "string" && price.trim().length > 0)
            : [];
          return { ...offer, prices };
        })
        .filter((offer) => typeof offer.title === "string" && offer.title.trim().length > 0);
    }
    if ("paragraphs" in next && Array.isArray(next.paragraphs)) {
      next.paragraphs = (next.paragraphs as unknown[]).filter(
        (paragraph) => typeof paragraph === "string" && paragraph.trim().length > 0,
      );
    }
    return next;
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updated = await updateSection(token, pageSlug, section.key, { content: sanitizeContent(content) });
      onUpdate(updated);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  function updateContent(key: string, value: unknown) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  const imagesFromContent = Array.isArray(content.images) ? (content.images as string[]) : [];
  const imageList =
    imagesFromContent.length > 0
      ? imagesFromContent
      : section.key === "approche" && typeof content.image === "string"
        ? [content.image]
        : [];
  const shouldShowImages = Array.isArray(content.images) || section.key === "approche";
  const bulletsList = Array.isArray(content.bullets) ? (content.bullets as string[]) : [];
  const offersList = Array.isArray(content.offers) ? (content.offers as Array<Record<string, unknown>>) : [];
  const paragraphsList = Array.isArray(content.paragraphs) ? (content.paragraphs as string[]) : [];
  const entrepriseCharacteristics = Array.isArray(content.characteristics) ? (content.characteristics as string[]) : [];
  const entrepriseTeamBenefits = Array.isArray(content.teamBenefits) ? (content.teamBenefits as string[]) : [];
  const entrepriseCompanyBenefits = Array.isArray(content.companyBenefits) ? (content.companyBenefits as string[]) : [];

  return (
    <section className="bo-card space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{section.key}</h3>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-md bg-amber-500 px-4 py-2 text-sm text-white hover:bg-amber-600"
          disabled={saving}
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600">Sauvegarde reussie.</p> : null}

      {"image" in content || section.key === "presentation" ? (
        <MediaPicker
          token={token}
          value={(content.image as string | null) ?? null}
          onChange={(path) => updateContent("image", path)}
          label="Image"
        />
      ) : null}

      {shouldShowImages ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <label className="block text-sm font-medium text-stone-600">Images</label>
            <button
              type="button"
              onClick={() => {
                const next = Array.isArray(content.images) ? [...content.images] : [...imageList];
                next.push("");
                updateContent("images", next);
              }}
              className="rounded-md border border-stone-200 px-3 py-1 text-sm text-stone-700 hover:border-amber-500 hover:text-amber-600"
            >
              Ajouter une image
            </button>
          </div>
          {imageList.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {imageList.map((path, index) => (
                <div key={`${section.key}-image-${index}`} className="rounded-lg border border-stone-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-stone-600">Image {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => {
                        const next = imageList.filter((_, i) => i !== index);
                        updateContent("images", next);
                      }}
                      className="rounded-md px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                    >
                      Supprimer
                    </button>
                  </div>
                  <MediaPicker
                    token={token}
                    value={path ?? null}
                    onChange={(newPath) => {
                      const next = [...imageList];
                      next[index] = newPath ?? "";
                      updateContent("images", next.filter((entry) => entry));
                    }}
                    label={`Image ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-500">Aucune image pour le moment.</p>
          )}
        </div>
      ) : null}

      {section.key === "approche" ? (
        <div className="space-y-4 rounded-lg border border-stone-200 p-4">
          <div>
            <label className="block text-sm font-medium text-stone-600">Titre des points</label>
            <input
              type="text"
              value={(content.bulletsTitle as string | undefined) ?? ""}
              onChange={(event) => updateContent("bulletsTitle", event.target.value)}
              className="mt-2 w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
              placeholder="Ce qui guide mes mains :"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <label className="block text-sm font-medium text-stone-600">Points</label>
              <button
                type="button"
                onClick={() => updateContent("bullets", [...bulletsList, ""])}
                className="rounded-md border border-stone-200 px-3 py-1 text-sm text-stone-700 hover:border-amber-500 hover:text-amber-600"
              >
                Ajouter un point
              </button>
            </div>
            <div className="space-y-2">
              {bulletsList.length === 0 ? (
                <p className="text-sm text-stone-500">Aucun point pour le moment.</p>
              ) : (
                bulletsList.map((bullet, index) => (
                  <div key={`${section.key}-bullet-${index}`} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bullet}
                      onChange={(event) => {
                        const next = [...bulletsList];
                        next[index] = event.target.value;
                        updateContent("bullets", next);
                      }}
                      className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
                      placeholder="Nouveau point"
                    />
                    <button
                      type="button"
                      onClick={() => updateContent("bullets", bulletsList.filter((_, i) => i !== index))}
                      className="rounded-md px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                    >
                      Supprimer
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600">Texte de conclusion</label>
            <textarea
              rows={3}
              value={(content.quote as string | undefined) ?? ""}
              onChange={(event) => updateContent("quote", event.target.value)}
              className="mt-2 w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
              placeholder="Chaque soin est pense comme une pause..."
            />
          </div>
        </div>
      ) : null}

      {section.key === "presentation" ? (
        <div className="space-y-4 rounded-lg border border-stone-200 p-4">
          <div>
            <label className="block text-sm font-medium text-stone-600">Titre</label>
            <input
              type="text"
              value={(content.title as string | undefined) ?? ""}
              onChange={(event) => updateContent("title", event.target.value)}
              className="mt-2 w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
              placeholder="Presentation"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <label className="block text-sm font-medium text-stone-600">Paragraphes</label>
              <button
                type="button"
                onClick={() => updateContent("paragraphs", [...paragraphsList, ""])}
                className="rounded-md border border-stone-200 px-3 py-1 text-sm text-stone-700 hover:border-amber-500 hover:text-amber-600"
              >
                Ajouter un paragraphe
              </button>
            </div>
            {paragraphsList.length === 0 ? (
              <p className="text-sm text-stone-500">Aucun paragraphe pour le moment.</p>
            ) : (
              <div className="space-y-2">
                {paragraphsList.map((paragraph, index) => (
                  <div key={`${section.key}-paragraph-${index}`} className="flex items-start gap-2">
                    <textarea
                      rows={2}
                      value={paragraph}
                      onChange={(event) => {
                        const next = [...paragraphsList];
                        next[index] = event.target.value;
                        updateContent("paragraphs", next);
                      }}
                      className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
                      placeholder="Nouveau paragraphe"
                    />
                    <button
                      type="button"
                      onClick={() => updateContent("paragraphs", paragraphsList.filter((_, i) => i !== index))}
                      className="mt-1 rounded-md px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600">Citation</label>
            <textarea
              rows={3}
              value={(content.quote as string | undefined) ?? ""}
              onChange={(event) => updateContent("quote", event.target.value)}
              className="mt-2 w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
              placeholder="Je m'adresse a tous ceux..."
            />
          </div>
        </div>
      ) : null}

      {section.key === "tarifs" ? (
        <div className="space-y-4 rounded-lg border border-stone-200 p-4">
          <div>
            <label className="block text-sm font-medium text-stone-600">Titre</label>
            <input
              type="text"
              value={(content.title as string | undefined) ?? ""}
              onChange={(event) => updateContent("title", event.target.value)}
              className="mt-2 w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
              placeholder="Carte & tarifs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600">Sous-titre</label>
            <textarea
              rows={2}
              value={(content.subtitle as string | undefined) ?? ""}
              onChange={(event) => updateContent("subtitle", event.target.value)}
              className="mt-2 w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
              placeholder="Une selection de soins..."
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <label className="block text-sm font-medium text-stone-600">Offres</label>
              <button
                type="button"
                onClick={() =>
                  updateContent("offers", [
                    ...offersList,
                    { title: "", description: "", prices: [""] },
                  ])
                }
                className="rounded-md border border-stone-200 px-3 py-1 text-sm text-stone-700 hover:border-amber-500 hover:text-amber-600"
              >
                Ajouter une offre
              </button>
            </div>

            {offersList.length === 0 ? (
              <p className="text-sm text-stone-500">Aucune offre pour le moment.</p>
            ) : (
              <div className="space-y-4">
                {offersList.map((offer, offerIndex) => {
                  const prices = Array.isArray(offer.prices) ? (offer.prices as string[]) : [];
                  return (
                    <div key={`${section.key}-offer-${offerIndex}`} className="rounded-lg border border-stone-200 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-stone-600">Offre {offerIndex + 1}</p>
                        <button
                          type="button"
                          onClick={() => updateContent("offers", offersList.filter((_, i) => i !== offerIndex))}
                          className="rounded-md px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                        >
                          Supprimer
                        </button>
                      </div>

                      <div className="mt-3 space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-stone-500">Titre</label>
                          <input
                            type="text"
                            value={(offer.title as string | undefined) ?? ""}
                            onChange={(event) => {
                              const next = [...offersList];
                              next[offerIndex] = { ...offer, title: event.target.value };
                              updateContent("offers", next);
                            }}
                            className="mt-1 w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-stone-500">Description</label>
                          <textarea
                            rows={2}
                            value={(offer.description as string | undefined) ?? ""}
                            onChange={(event) => {
                              const next = [...offersList];
                              next[offerIndex] = { ...offer, description: event.target.value };
                              updateContent("offers", next);
                            }}
                            className="mt-1 w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-medium text-stone-500">Prix</label>
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...offersList];
                                const nextPrices = [...prices, ""];
                                next[offerIndex] = { ...offer, prices: nextPrices };
                                updateContent("offers", next);
                              }}
                              className="rounded-md border border-stone-200 px-2 py-1 text-xs text-stone-700 hover:border-amber-500 hover:text-amber-600"
                            >
                              Ajouter un prix
                            </button>
                          </div>
                          {prices.length === 0 ? (
                            <p className="text-xs text-stone-500">Aucun prix.</p>
                          ) : (
                            prices.map((price, priceIndex) => (
                              <div key={`${section.key}-offer-${offerIndex}-price-${priceIndex}`} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={price}
                                  onChange={(event) => {
                                    const next = [...offersList];
                                    const nextPrices = [...prices];
                                    nextPrices[priceIndex] = event.target.value;
                                    next[offerIndex] = { ...offer, prices: nextPrices };
                                    updateContent("offers", next);
                                  }}
                                  className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = [...offersList];
                                    const nextPrices = prices.filter((_, i) => i !== priceIndex);
                                    next[offerIndex] = { ...offer, prices: nextPrices };
                                    updateContent("offers", next);
                                  }}
                                  className="rounded-md px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                                >
                                  Supprimer
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {section.key === "entreprise" ? (
        <div className="space-y-4 rounded-lg border border-stone-200 p-4">
          <div>
            <label className="block text-sm font-medium text-stone-600">Titre principal</label>
            <input
              type="text"
              value={(content.title as string | undefined) ?? ""}
              onChange={(event) => updateContent("title", event.target.value)}
              className="mt-2 w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
              placeholder="Massage Amma en entreprise"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600">Sous-titre</label>
            <textarea
              rows={2}
              value={(content.subtitle as string | undefined) ?? ""}
              onChange={(event) => updateContent("subtitle", event.target.value)}
              className="mt-2 w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
              placeholder="Massage Amma assis : rapide, efficace..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-stone-600">Bloc Equipes</label>
              <input
                type="text"
                value={(content.teamTitle as string | undefined) ?? ""}
                onChange={(event) => updateContent("teamTitle", event.target.value)}
                className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
                placeholder="Pour vos equipes"
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-stone-500">Points</span>
                  <button
                    type="button"
                    onClick={() => updateContent("teamBenefits", [...entrepriseTeamBenefits, ""])}
                    className="rounded-md border border-stone-200 px-2 py-1 text-xs text-stone-700 hover:border-amber-500 hover:text-amber-600"
                  >
                    Ajouter
                  </button>
                </div>
                {entrepriseTeamBenefits.length === 0 ? (
                  <p className="text-xs text-stone-500">Aucun point.</p>
                ) : (
                  entrepriseTeamBenefits.map((benefit, index) => (
                    <div key={`entreprise-team-${index}`} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(event) => {
                          const next = [...entrepriseTeamBenefits];
                          next[index] = event.target.value;
                          updateContent("teamBenefits", next);
                        }}
                        className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateContent("teamBenefits", entrepriseTeamBenefits.filter((_, i) => i !== index))
                        }
                        className="rounded-md px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-stone-600">Bloc Entreprise</label>
              <input
                type="text"
                value={(content.companyTitle as string | undefined) ?? ""}
                onChange={(event) => updateContent("companyTitle", event.target.value)}
                className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
                placeholder="Pour votre entreprise"
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-stone-500">Points</span>
                  <button
                    type="button"
                    onClick={() => updateContent("companyBenefits", [...entrepriseCompanyBenefits, ""])}
                    className="rounded-md border border-stone-200 px-2 py-1 text-xs text-stone-700 hover:border-amber-500 hover:text-amber-600"
                  >
                    Ajouter
                  </button>
                </div>
                {entrepriseCompanyBenefits.length === 0 ? (
                  <p className="text-xs text-stone-500">Aucun point.</p>
                ) : (
                  entrepriseCompanyBenefits.map((benefit, index) => (
                    <div key={`entreprise-company-${index}`} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(event) => {
                          const next = [...entrepriseCompanyBenefits];
                          next[index] = event.target.value;
                          updateContent("companyBenefits", next);
                        }}
                        className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateContent("companyBenefits", entrepriseCompanyBenefits.filter((_, i) => i !== index))
                        }
                        className="rounded-md px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-stone-600">Caracteristiques</label>
              <button
                type="button"
                onClick={() => updateContent("characteristics", [...entrepriseCharacteristics, ""])}
                className="rounded-md border border-stone-200 px-2 py-1 text-xs text-stone-700 hover:border-amber-500 hover:text-amber-600"
              >
                Ajouter
              </button>
            </div>
            {entrepriseCharacteristics.length === 0 ? (
              <p className="text-xs text-stone-500">Aucune caracteristique.</p>
            ) : (
              entrepriseCharacteristics.map((item, index) => (
                <div key={`entreprise-characteristic-${index}`} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(event) => {
                      const next = [...entrepriseCharacteristics];
                      next[index] = event.target.value;
                      updateContent("characteristics", next);
                    }}
                    className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateContent("characteristics", entrepriseCharacteristics.filter((_, i) => i !== index))
                    }
                    className="rounded-md px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                  >
                    Supprimer
                  </button>
                </div>
              ))
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600">Citation</label>
            <textarea
              rows={3}
              value={(content.quote as string | undefined) ?? ""}
              onChange={(event) => updateContent("quote", event.target.value)}
              className="mt-2 w-full rounded-md border border-stone-200 px-3 py-2 text-sm"
              placeholder="Le massage Amma assis..."
            />
          </div>
        </div>
      ) : null}

      {"slides" in content && Array.isArray(content.slides) ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <label className="block text-sm font-medium text-stone-600">Slides</label>
            <button
              type="button"
              onClick={() => {
                const next = [...(content.slides as Array<Record<string, unknown>>), { image: null }];
                updateContent("slides", next);
              }}
              className="rounded-md border border-stone-200 px-3 py-1 text-sm text-stone-700 hover:border-amber-500 hover:text-amber-600"
            >
              Ajouter une image
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(content.slides as Array<Record<string, unknown>>).map((slide, index) => (
              <div key={`${section.key}-slide-${index}`} className="rounded-lg border border-stone-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-stone-600">Slide {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => {
                      const next = (content.slides as Array<Record<string, unknown>>).filter((_, i) => i !== index);
                      updateContent("slides", next);
                    }}
                    className="rounded-md px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                  >
                    Supprimer
                  </button>
                </div>
                <MediaPicker
                  token={token}
                  value={(slide.image as string | null) ?? null}
                  onChange={(path) => {
                    const next = [...(content.slides as Array<Record<string, unknown>>)];
                    next[index] = { ...next[index], image: path };
                    updateContent("slides", next);
                  }}
                  label={`Image slide ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
