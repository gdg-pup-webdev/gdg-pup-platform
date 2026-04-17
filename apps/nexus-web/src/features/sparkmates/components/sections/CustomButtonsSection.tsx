import { Button, Text, Modal, Input } from "@packages/spark-ui";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useEffect, useMemo, useState, type CSSProperties } from "react";
import { addIcon } from "../SparkmatesOwnerView/icons/addIcon";
import { burgerIcon } from "../SparkmatesOwnerView/icons/burgerIcon";
import { editIcon } from "../SparkmatesOwnerView/icons/editIcon"; 
import { UserProfile, useUpdateSparkmateProfile } from "@/features/sparkmates";
import { getLinkHostname } from "../SparkmatesOwnerView/utils/getLinkHostname";
import {
  parseCustomButtonLinks,
  serializeCustomButtonLinks,
} from "../../utils/customButtonFavorites";

const toExternalHref = (raw: string): string | null => {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  return `https://${trimmed}`;
};

const getYoutubeEmbedUrl = (href: string): string | null => {
  try {
    const parsed = new URL(href);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host.endsWith("youtube.com")) {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      const shortId = parsed.pathname.split("/").filter(Boolean)[1];
      if (parsed.pathname.startsWith("/shorts/") && shortId) {
        return `https://www.youtube.com/embed/${shortId}`;
      }

      const embedId = parsed.pathname.split("/").filter(Boolean)[1];
      if (parsed.pathname.startsWith("/embed/") && embedId) {
        return `https://www.youtube.com/embed/${embedId}`;
      }
    }

    return null;
  } catch {
    return null;
  }
};

const toPreviewMeta = (href: string): { host: string; path: string; favicon: string | null } => {
  try {
    const parsed = new URL(href);
    const host = parsed.hostname.replace(/^www\./, "");
    const path = `${parsed.pathname}${parsed.search}` || "/";
    const favicon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`;

    return {
      host,
      path,
      favicon,
    };
  } catch {
    return {
      host: getLinkHostname(href),
      path: href,
      favicon: null,
    };
  }
};

type SortableCustomButtonItemProps = {
  id: string;
  link: string;
  onRemove: () => void;
  sortingDisabled?: boolean;
};

const SortableCustomButtonItem = ({
  id,
  link,
  onRemove,
  sortingDisabled = false,
}: SortableCustomButtonItemProps) => {
  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: sortingDisabled });

  const constrainedTransform = transform
    ? {
      ...transform,
      x: 0,
      scaleX: 1,
      scaleY: 1,
    }
    : null;

  const style: CSSProperties = {
    transform: CSS.Transform.toString(constrainedTransform),
    transition,
    position: isDragging ? "relative" : undefined,
    zIndex: isDragging ? 30 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/5 border border-white/10"
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          disabled={sortingDisabled}
          className="h-8 w-8 shrink-0 rounded-md border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 cursor-grab active:cursor-grabbing"
          aria-label="Reorder link"
        >
          <span className="flex items-center justify-center">{burgerIcon}</span>
        </button>
        <Text variant="body-sm" className="truncate flex-1 text-white">{link}</Text>
      </div>
      <Button variant="ghost" size="sm" onClick={onRemove} className="text-red-400">Remove</Button>
    </div>
  );
};

export const CustomButtonsSection = ({ profile, readOnly }: { profile: UserProfile; readOnly?: boolean }) => {
  const parsedProfileLinks = useMemo(
    () => parseCustomButtonLinks(profile.otherLinks),
    [profile.otherLinks],
  );
  const { mutate: updateProfile, isPending } = useUpdateSparkmateProfile(profile.gdgId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [links, setLinks] = useState<string[]>(parsedProfileLinks.links);
  const [starredCustomButtons, setStarredCustomButtons] = useState<Set<string>>(
    () => new Set(parsedProfileLinks.starredUrls),
  );
  const [newLink, setNewLink] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    setLinks(parsedProfileLinks.links);
    setStarredCustomButtons(new Set(parsedProfileLinks.starredUrls));
  }, [parsedProfileLinks]);

  const toggleStar = (url: string) => {
    if (readOnly || isPending) {
      return;
    }

    setStarredCustomButtons((prev) => {
      const next = new Set(prev);
      if (next.has(url)) {
        next.delete(url);
      } else {
        next.add(url);
      }

      updateProfile({ otherLinks: serializeCustomButtonLinks(links, next) });

      return next;
    });
  };

  const handleAddLink = () => {
    const normalizedLink = newLink.trim();
    if (normalizedLink && !links.includes(normalizedLink)) {
      setLinks((previousLinks) => [...previousLinks, normalizedLink]);
      setNewLink("");
    }
  };

  const handleRemoveLink = (index: number) => {
    const removedLink = links[index];
    setLinks(links.filter((_, i) => i !== index));
    setStarredCustomButtons((prev) => {
      const next = new Set(prev);
      next.delete(removedLink);
      return next;
    });
  };

  const handleSave = () => {
    updateProfile({ otherLinks: serializeCustomButtonLinks(links, starredCustomButtons) }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
      },
    });
  };

  const handleLinkDragEnd = (event: DragEndEvent) => {
    if (isPending) {
      return;
    }

    const { active, over } = event;
    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) {
      return;
    }

    const fromIndex = sortableLinkIds.indexOf(activeId);
    const toIndex = sortableLinkIds.indexOf(overId);

    if (fromIndex < 0 || toIndex < 0) {
      return;
    }

    setLinks((previousLinks) => arrayMove(previousLinks, fromIndex, toIndex));
  };

  const customLinks = links.map((url) => {
    const href = toExternalHref(url);
    const previewMeta = href ? toPreviewMeta(href) : null;

    return {
      title: getLinkHostname(url),
      url,
      href,
      embedUrl: href ? getYoutubeEmbedUrl(href) : null,
      previewMeta,
    };
  });

  const sortableLinkIds = useMemo(
    () => links.map((link, index) => `${index}::${link}`),
    [links],
  );

  return (
    <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Text variant="heading-6" gradient="white-blue" weight="bold">
            Custom Button
          </Text>
          {!readOnly && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white"
              title="Edit Custom Button"
              aria-label="Edit Custom Button"
              onClick={() => setIsEditModalOpen(true)}
            >
              {editIcon}
            </Button>
          )}
        </div>
        <Text variant="body-sm" className="text-[#C1C7CD]">
          Add a custom button that appears on your profile.
        </Text>
        <div className="space-y-2.5">
          {customLinks.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className={`relative overflow-hidden rounded-2xl p-5 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.25)] transition-[box-shadow,background] duration-300 ${
                starredCustomButtons.has(item.url)
                  ? "rainbow-border bg-[linear-gradient(90deg,#0F2449_0%,#2A4F91_50%,#0F2449_100%)]"
                  : "border border-white/20 bg-[rgba(255,255,255,0.05)]"
              }`}
            >
              <div className="flex items-start justify-between min-w-0">
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="min-w-0 flex-1 pr-2 transition-opacity hover:opacity-95"
                  >
                    <Text
                      variant="body-lg"
                      className="text-white truncate block"
                      weight="medium"
                    >
                      {item.title}
                    </Text>
                    <Text variant="body" className="text-[#E5E5E5] break-all block pr-4">
                      {item.url}
                    </Text>

                    {item.embedUrl ? (
                      <div className="mt-3 w-full overflow-hidden rounded-xl bg-[#07142b]/60 ring-1 ring-white/12">
                        <iframe
                          title={`Preview of ${item.title}`}
                          src={item.embedUrl}
                          className="h-52 w-full"
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#07142b]/55 px-3 py-2.5 ring-1 ring-white/12">
                        {item.previewMeta?.favicon ? (
                          <img
                            src={item.previewMeta.favicon}
                            alt=""
                            aria-hidden
                            className="h-6 w-6 rounded shrink-0"
                          />
                        ) : null}
                        <div className="min-w-0">
                          <Text variant="body-sm" className="text-white truncate">
                            {item.previewMeta?.host || item.title}
                          </Text>
                          <Text variant="body-sm" className="text-[#C1C7CD] truncate">
                            {item.previewMeta?.path || item.url}
                          </Text>
                        </div>
                      </div>
                    )}
                  </a>
                ) : (
                  <div className="min-w-0 flex-1 pr-2">
                    <Text
                      variant="body-lg"
                      className="text-white truncate block"
                      weight="medium"
                    >
                      {item.title}
                    </Text>
                    <Text variant="body" className="text-[#E5E5E5] break-all block pr-4">
                      {item.url}
                    </Text>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-white shrink-0 disabled:cursor-default disabled:opacity-100"
                  onClick={() => toggleStar(item.url)}
                  disabled={readOnly || isPending}
                  aria-label={starredCustomButtons.has(item.url) ? "Starred custom button" : "Unstarred custom button"}
                >
                  {starredCustomButtons.has(item.url) ? "★" : "☆"}
                </Button>
              </div>
            </div>
          ))}
          {customLinks.length === 0 ? (
            <div className="rounded-2xl border border-white/15 bg-[rgba(255,255,255,0.04)] px-5 py-4 text-center">
              <Text variant="body-sm" className="text-[#C1C7CD]">
                No custom links yet.
              </Text>
            </div>
          ) : null}
        </div>
        {!readOnly && (
          <Button 
            variant="dashed-outline" 
            className="w-full" 
            iconLeft={addIcon}
            onClick={() => setIsEditModalOpen(true)}
          >
            Add Custom Buttons
          </Button>
        )}

        {!readOnly && (
          <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} scrollBehavior="inside" size="sm" className="bg-[#091734] text-white border border-white/10">
            <div className="">
              <div>
                <Text variant="heading-6" weight="bold" className="text-white">Manage Custom Buttons</Text>
                <Text variant="body-sm" className="text-zinc-400 mt-1">
                  Add prominent links to other platforms that will appear on your profile.
                </Text>
              </div>
              
              <div className="space-y-1.5">
                <Text variant="body-sm" className="text-zinc-300 font-medium">Link URL</Text>
                <div className="flex gap-2">
                  <Input 
                    value={newLink} 
                    onChange={(e) => setNewLink(e.target.value)} 
                    placeholder="https://your-link.com"
                    containerClassName="bg-white/5 border-white/10"
                    className="bg-transparent text-white placeholder:text-white/40"
                  />
                  <Button variant="default" onClick={handleAddLink}>Add</Button>
                </div>
              </div>

              {links.length > 0 && (
                <div className="space-y-2">
                  <Text variant="body-sm" className="text-zinc-300 font-medium">
                    Added Links (drag to reorder)
                  </Text>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleLinkDragEnd}
                  >
                    <SortableContext items={sortableLinkIds} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {links.map((link, index) => (
                          <SortableCustomButtonItem
                            key={sortableLinkIds[index]}
                            id={sortableLinkIds[index]}
                            link={link}
                            onRemove={() => handleRemoveLink(index)}
                            sortingDisabled={isPending}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button variant="default" onClick={handleSave} disabled={isPending}>
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </Modal>
        )}
    </section>
  );
};
