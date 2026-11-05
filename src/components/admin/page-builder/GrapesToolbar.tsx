import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Monitor,
  PanelRight,
  Redo2,
  Smartphone,
  SquareDashed,
  Tablet,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { Button, IconButton } from "@/components/admin/ui";
import { GRAPES_DEVICES, type GrapesDevice } from "./grapesConfig";

const DEVICE_ICONS: Record<GrapesDevice, LucideIcon> = { desktop: Monitor, tablet: Tablet, mobile: Smartphone };

interface ToolProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

function Tool({ icon: Icon, label, active, disabled, onClick }: ToolProps) {
  return (
    <IconButton
      icon={<Icon className="h-4 w-4" />}
      label={label}
      title={label}
      variant={active ? "darkActive" : "dark"}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
    />
  );
}

interface GrapesToolbarProps {
  pageTitle: string;
  device: GrapesDevice;
  previewing: boolean;
  outlines: boolean;
  rightPanelOpen: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isDirty: boolean;
  isReady: boolean;
  isSaving: boolean;
  isPublished: boolean;
  canShare: boolean;
  isShared: boolean;
  onLeave: (event: React.MouseEvent) => void;
  onBackToOldEditor?: () => void;
  onDevice: (device: GrapesDevice) => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleOutlines: () => void;
  onTogglePreview: () => void;
  onToggleRightPanel: () => void;
  onDetails: () => void;
  onShare: () => void;
  onDetach: () => void;
  onSave: (publishCurrentPage: boolean) => void;
}

export function GrapesToolbar({
  pageTitle,
  device,
  previewing,
  outlines,
  rightPanelOpen,
  canUndo,
  canRedo,
  isDirty,
  isReady,
  isSaving,
  isPublished,
  canShare,
  isShared,
  onLeave,
  onBackToOldEditor,
  onDevice,
  onUndo,
  onRedo,
  onToggleOutlines,
  onTogglePreview,
  onToggleRightPanel,
  onDetails,
  onShare,
  onDetach,
  onSave,
}: GrapesToolbarProps) {
  return (
    <header className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-stone-700 bg-stone-900 px-2 py-1.5">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Link
          href="/admin/pages"
          onClick={onLeave}
          aria-label="Retour à la liste des pages"
          title="Retour à la liste des pages"
          className="rounded-md p-2 text-stone-300 hover:bg-stone-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="truncate text-sm font-semibold text-white">{pageTitle}</h1>
        <Button variant="dark" size="sm" onClick={onDetails}>
          Titre et URL
        </Button>
        {onBackToOldEditor && (
          <Button variant="dark" size="sm" onClick={onBackToOldEditor}>
            Ancien éditeur
          </Button>
        )}
      </div>

      <div role="group" aria-label="Taille d'écran" className="flex items-center gap-0.5 rounded-md border border-stone-700 p-0.5">
        {GRAPES_DEVICES.map(({ id, name }) => (
          <Tool key={id} icon={DEVICE_ICONS[id]} label={name} active={device === id} onClick={() => onDevice(id)} />
        ))}
      </div>

      <div className="flex flex-1 flex-wrap items-center justify-end gap-1">
        <Tool icon={SquareDashed} label="Afficher les contours" active={outlines} disabled={previewing} onClick={onToggleOutlines} />
        <Tool icon={Undo2} label="Annuler" disabled={!canUndo || previewing} onClick={onUndo} />
        <Tool icon={Redo2} label="Rétablir" disabled={!canRedo || previewing} onClick={onRedo} />
        <Tool icon={previewing ? EyeOff : Eye} label={previewing ? "Quitter l'aperçu" : "Aperçu"} active={previewing} onClick={onTogglePreview} />
        <Tool icon={PanelRight} label="Panneau des styles" active={rightPanelOpen} disabled={previewing} onClick={onToggleRightPanel} />

        {canShare && (
          <Button variant="dark" size="sm" onClick={onShare}>
            Partager ce bloc
          </Button>
        )}
        {isShared && (
          <Button variant="dark" size="sm" onClick={onDetach}>
            Détacher
          </Button>
        )}

        {isDirty && <span className="px-1 text-xs text-amber-400">Non enregistré</span>}
        {!isPublished && (
          <Button variant="dark" size="sm" loading={isSaving} disabled={!isReady} onClick={() => onSave(false)}>
            Enregistrer le brouillon
          </Button>
        )}
        <Button size="sm" loading={isSaving} disabled={!isReady} onClick={() => onSave(!isPublished)} className="focus:ring-offset-stone-900">
          {isPublished ? "Enregistrer et publier" : "Publier cette page"}
        </Button>
      </div>
    </header>
  );
}
