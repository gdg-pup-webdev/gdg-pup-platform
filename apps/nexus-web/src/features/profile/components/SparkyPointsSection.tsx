"use client";

import { ASSETS } from "@/lib/constants/assets";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/providers/AuthProvider";
import {  Button, Container, Dropdown, DropdownContent, DropdownItem, DropdownTrigger, Grid, Inline, Stack, Text } from "@packages/spark-ui";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { HistoryItemProps, TaskItem, RewardItem } from "../types";
import { useSparkyPoints } from "../hooks/useSparkyPoints";

type mobileSections = "main" | "guide" | "redeem" | "history";

function formatDate(date:Date) {
  const days = String(date.getDate()).padStart(2, '0');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  let hours: string | number = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = String(hours % 12 || 12).padStart(2, '0');

  return `${days}, ${month} ${year} . ${hours}:${minutes} ${ampm}`;
}

const GRADIENT_BORDER_BASE = "relative isolate before:content-[''] before:absolute before:-inset-px before:rounded-[inherit] before:p-px before:bg-size-[100%_100%] before:pointer-events-none before:z-[-1] before:mask-[linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] before:[mask-origin:content-box,border-box] before:[mask-clip:content-box,border-box] before:mask-exclude";
const RAINBOW_GRADIENT_COLOR = "before:bg-[linear-gradient(to_bottom_right,#FB2C36_0%,#F0B100_5%,#00C950_10%,#2B7FFF_15%,#FFFFFF_50.48%,#2B7FFF_85%,#00C950_90%,#F0B100_95%,#FB2C36_100%)]";
const RAINBOW_BORDER = cn(GRADIENT_BORDER_BASE, RAINBOW_GRADIENT_COLOR);

function LeftArrowSvg() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.41503 7.66929L7.36503 11.6193C7.54269 11.8087 7.63967 12.0599 7.63545 12.3196C7.63124 12.5792 7.52615 12.8271 7.34244 13.0107C7.15873 13.1943 6.9108 13.2992 6.65111 13.3032C6.39143 13.3072 6.14036 13.2101 5.95103 13.0323L0.294035 7.37629C0.20085 7.28363 0.1269 7.17347 0.076439 7.05214C0.0259776 6.93081 0 6.8007 0 6.66929C0 6.53788 0.0259776 6.40777 0.076439 6.28644C0.1269 6.1651 0.20085 6.05494 0.294035 5.96229L5.95103 0.305288C6.04328 0.209778 6.15363 0.133596 6.27563 0.0811868C6.39763 0.0287778 6.52885 0.00119157 6.66163 3.77567e-05C6.79441 -0.00111606 6.92609 0.0241857 7.04899 0.0744665C7.17189 0.124747 7.28354 0.199001 7.37743 0.292893C7.47132 0.386786 7.54558 0.498438 7.59586 0.621334C7.64614 0.744231 7.67144 0.87591 7.67029 1.00869C7.66913 1.14147 7.64155 1.27269 7.58914 1.39469C7.53673 1.5167 7.46054 1.62704 7.36503 1.71929L3.41503 5.66929H13.001C13.2663 5.66929 13.5206 5.77464 13.7081 5.96218C13.8957 6.14972 14.001 6.40407 14.001 6.66929C14.001 6.9345 13.8957 7.18886 13.7081 7.37639C13.5206 7.56393 13.2663 7.66929 13.001 7.66929H3.41503Z" fill="#FAFAFA" />
  </svg>;
}

function RightArrowGradientSvg() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="url(#paint0_linear_3686_21633)" />
    <defs>
      <linearGradient id="paint0_linear_3686_21633" x1="0.916667" y1="2.76923" x2="-1.29073" y2="15.6227" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" />
        <stop offset="1" stopColor="#F9AB00" />
      </linearGradient>
    </defs>
  </svg>;
}

function CircledMinusSvg(): import("react").ReactNode {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18C6.61305 18 4.32387 17.0518 2.63604 15.364C0.948211 13.6761 0 11.3869 0 9C0 6.61305 0.948211 4.32387 2.63604 2.63604C4.32387 0.948211 6.61305 0 9 0C11.3869 0 13.6761 0.948211 15.364 2.63604C17.0518 4.32387 18 6.61305 18 9C18 11.3869 17.0518 13.6761 15.364 15.364C13.6761 17.0518 11.3869 18 9 18ZM9 16.2C10.9096 16.2 12.7409 15.4414 14.0912 14.0912C15.4414 12.7409 16.2 10.9096 16.2 9C16.2 7.09044 15.4414 5.25909 14.0912 3.90883C12.7409 2.55857 10.9096 1.8 9 1.8C7.09044 1.8 5.25909 2.55857 3.90883 3.90883C2.55857 5.25909 1.8 7.09044 1.8 9C1.8 10.9096 2.55857 12.7409 3.90883 14.0912C5.25909 15.4414 7.09044 16.2 9 16.2ZM13.5 8.1V9.9H4.5V8.1H13.5Z" fill="currentColor" />
  </svg>;
}

function CircledPlusSvg(): import("react").ReactNode {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 0C4.03754 0 0 4.03754 0 9C0 13.9625 4.03754 18 9 18C13.9625 18 18 13.9625 18 9C18 4.03754 13.9625 0 9 0ZM9 1.38462C13.2141 1.38462 16.6154 4.78592 16.6154 9C16.6154 13.2141 13.2141 16.6154 9 16.6154C4.78592 16.6154 1.38462 13.2141 1.38462 9C1.38462 4.78592 4.78592 1.38462 9 1.38462ZM8.30769 4.84615V8.30769H4.84615V9.69231H8.30769V13.1538H9.69231V9.69231H13.1538V8.30769H9.69231V4.84615H8.30769Z" fill="currentColor" />
  </svg>;
}

function RightIconSvg() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="white" />
  </svg>;
}

function DownChevronSvg(): import("react").ReactNode {
  return <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>;
}

function HistoryIconSvg(): import("react").ReactNode {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 24C9.2 24 6.72222 23.1502 4.56667 21.4507C2.41111 19.7511 1.01111 17.5787 0.366667 14.9333C0.277778 14.6 0.344444 14.2947 0.566667 14.0173C0.788889 13.74 1.08889 13.5787 1.46667 13.5333C1.82222 13.4889 2.14444 13.5556 2.43333 13.7333C2.72222 13.9111 2.92222 14.1778 3.03333 14.5333C3.56667 16.5333 4.66667 18.1667 6.33333 19.4333C8 20.7 9.88889 21.3333 12 21.3333C14.6 21.3333 16.8058 20.428 18.6173 18.6173C20.4289 16.8067 21.3342 14.6009 21.3333 12C21.3324 9.39911 20.4271 7.19378 18.6173 5.384C16.8076 3.57422 14.6018 2.66844 12 2.66667C10.4667 2.66667 9.03333 3.02222 7.7 3.73333C6.36667 4.44444 5.24444 5.42222 4.33333 6.66667H6.66667C7.04444 6.66667 7.36133 6.79466 7.61733 7.05066C7.87333 7.30666 8.00089 7.62311 8 8C7.99911 8.37689 7.87111 8.69378 7.616 8.95066C7.36089 9.20755 7.04444 9.33511 6.66667 9.33333H1.33333C0.955555 9.33333 0.639111 9.20533 0.384 8.94933C0.128889 8.69333 0.000888889 8.37689 0 8V2.66667C0 2.28889 0.128 1.97244 0.384 1.71733C0.64 1.46222 0.956444 1.33422 1.33333 1.33333C1.71022 1.33244 2.02711 1.46044 2.284 1.71733C2.54089 1.97422 2.66844 2.29067 2.66667 2.66667V4.46667C3.8 3.04444 5.18356 1.94444 6.81733 1.16667C8.45111 0.388889 10.1787 0 12 0C13.6667 0 15.228 0.316889 16.684 0.950666C18.14 1.58444 19.4067 2.43955 20.484 3.516C21.5613 4.59244 22.4169 5.85911 23.0507 7.316C23.6844 8.77289 24.0009 10.3342 24 12C23.9991 13.6658 23.6827 15.2271 23.0507 16.684C22.4187 18.1409 21.5631 19.4076 20.484 20.484C19.4049 21.5604 18.1382 22.416 16.684 23.0507C15.2298 23.6853 13.6684 24.0018 12 24ZM13.3333 11.4667L16.6667 14.8C16.9111 15.0444 17.0333 15.3556 17.0333 15.7333C17.0333 16.1111 16.9111 16.4222 16.6667 16.6667C16.4222 16.9111 16.1111 17.0333 15.7333 17.0333C15.3556 17.0333 15.0444 16.9111 14.8 16.6667L11.0667 12.9333C10.9333 12.8 10.8333 12.6502 10.7667 12.484C10.7 12.3178 10.6667 12.1453 10.6667 11.9667V6.66667C10.6667 6.28889 10.7947 5.97244 11.0507 5.71733C11.3067 5.46222 11.6231 5.33422 12 5.33333C12.3769 5.33244 12.6938 5.46044 12.9507 5.71733C13.2076 5.97422 13.3351 6.29067 13.3333 6.66667V11.4667Z" fill="currentColor" />
  </svg>;
}

function GuideIconSvg(): import("react").ReactNode {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M0 1.26876V20.3781L12 24L24 20.3781V1.26986L22.1073 0L12 3.05117L1.89273 0L0 1.26876ZM12 5.34175L2.18182 2.37838V18.745L10.9091 21.3791V8.86157L13.0909 8.20304V21.3791L21.8182 18.745V2.37838L12 5.34175ZM19.6364 6.23295L15.2727 7.55001V9.84168L19.6364 8.52463V6.23295Z" fill="currentColor" />
  </svg>;
}

function PointsDisplay({points}: {points: number}) {
  return (
    <Stack>
      <div className={cn(RAINBOW_BORDER, "flex rounded-lg gap-4 p-4 shadow-[0px_4px_16px_0px_#FFFFFF40_inset]")}
        >
        <Inline gap={"xs"} className="flex-1">
          <Text variant={"heading-3"} gradient={"white-yellow"}>{points}</Text>
          <Text gradient={"white-yellow"} variant={"body-lg"}>point{points === 1 ? "" : "s"}</Text>
        </Inline>
        <div className="aspect-square h-full max-h-25">
          <img src={ASSETS.PROFILE.SPARKY_POINTS.CIRBY_DISPLAY} alt="CIRBY STICKER" className="w-full h-full"/>
        </div>
      </div>
      <Text variant="body-sm" color="muted">Spark Points reflect your participation and contributions across GDG PUP events and activities. They’re designed to recognize effort, not competition.</Text>
    </Stack>
  )
}

function MobileSubHeader({sectionTitle, onGoBack}:{sectionTitle:string, onGoBack: () => void}) {
  return <>
    <div className="flex justify-between items-center">
    <a className="inline-flex w-6 h-6 items-center justify-center" onClick={onGoBack}>
      <LeftArrowSvg/>
    </a>
    <Text gradient="white-blue" variant="heading-5" align="center" weight="bold">{sectionTitle}</Text>
    <a className="inline-flex w-6 h-6"></a>
  </div>
  </>
}

function QuickAction({text, onNavigate}: {text: string, onNavigate: () => void}) {
  return (
    <div className={cn(RAINBOW_BORDER, "h-25 px-3 py-2 flex items-end rounded-lg shadow-[0px_4px_16px_0px_#FFFFFF40_inset]")}>
      <a className="flex justify-between items-end gap-4 cursor-pointer w-full" onClick={onNavigate}>
        <Text weight={"bold"} className="text-inherit text-sm">{text}</Text>
        <p className="h-6 w-6 px-1 inline-flex justify-center items-center">
          <RightArrowGradientSvg/>
        </p>
      </a>
    </div>
  );
}

function TaskItem({id, name, points, description}: TaskItem) {
  return (
    <a className={cn(RAINBOW_BORDER, "p-4 h-25 lg:h-auto flex flex-col relative isolate rounded-lg shadow-[0px_4px_16px_0px_#FFFFFF0D_inset]")}
      id={`tasks-${id}`}
      >
      <span className="flex justify-between items-center">
        <Text gradient="white-yellow" className="font-bold">{name}</Text>
        <Text color="success" variant="body-sm">+{points} pts</Text>
      </span>
      <Text color="muted" variant="body-sm" clamp={3}>{description}</Text>
    </a>
  )
}

function RewardItem({id, name, cost, src, onRedeem}: RewardItem & {onRedeem: () => void}) {
  return (
    <div className={cn(RAINBOW_BORDER, "flex flex-col relative isolate rounded-2xl gap-4 p-4 shadow-[0px_4px_16px_0px_#FFFFFF40_inset]")}
      id={`rewards-${id}`}
    >
      <div className="aspect-square w-full">
        <Image src={src} alt={`${name} - ${cost} pts`} className="w-full h-full"/>
      </div>
      <Text gradient="white-yellow" align="center" variant="heading-6" weight="bold">{name}</Text>
      <Button onClick={onRedeem}>Redeem</Button>
    </div>
  )
}

function GuideItem({title, children, clamp}: {title: string, children: string, clamp?: 1 | "none" | 2 | 3 | 4 | null | undefined}) {
  return (
    <Stack gap="xs" className={cn(RAINBOW_BORDER, "relative isolate rounded-lg p-4 shadow-[0px_4px_16px_0px_#FFFFFF40]")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex">
            <img 
              src={ASSETS.PROFILE.SPARKY_POINTS.SPARKY_FACE} 
              alt="sparky" 
              className="w-full h-full"
            />
          </div>
          <Text gradient="white-blue" weight="bold" className="text-lg">{title}</Text>
        </div>
      </div>
      <Text variant="body" className="text-inherit" clamp={clamp}>
        {children}
      </Text>
    </Stack>
  )
}

function HistoryItem({type, data, avatar}: HistoryItemProps & {
  avatar: string
}) {
  const isEarned = type === "plus";
  return (
    <Stack gap="xs" className={cn(RAINBOW_BORDER, "relative isolate rounded-lg p-4 shadow-[0px_4px_16px_0px_#FFFFFF40_inset]")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex">
            <img 
              src={avatar || ASSETS.PROFILE.SPARKY_POINTS.SPARKY_FACE} 
              alt="sparky" 
              className={`w-full h-full ${avatar !== "" ? "rounded-full" : ""}`}
            />
          </div>
          <Text variant="body-sm" color="muted">{formatDate(data.timestamp)}</Text>
        </div>
        <Text as="div" variant="body-sm" color={isEarned ? "success" : "error"} className="flex items-center gap-2">
          {
            isEarned
              ? <CircledPlusSvg/>
              : <CircledMinusSvg/>
          }
          {isEarned ? data.points : data.cost} pts
        </Text>
      </div>
      <Text variant="body" className="text-inherit">
        {
          isEarned
            ? <>You earned <strong>+{data.points}</strong> Sparky Points after completing <strong>{data.name}</strong>.</>
            : <>You redeemed <strong>{data.name}</strong> for <strong>{data.cost}</strong> points.</>
        }
      </Text>
    </Stack>
  )
}

type ModalProps = {
  children?: React.ReactNode | null | undefined;
  isOpen: boolean;
  onClose: () => void;
}

function Modal({children, isOpen, onClose}: ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed bg-[#000000A0] inset-0 z-50 grid place-items-center p-8" onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClose();
      }}>
        <Stack className="bg-[#010B1D] w-full max-w-112 p-4 lg:p-6 gap-4 rounded-t-2xl lg:rounded-2xl box-border" align="center" onClick={(e) => {
              e.stopPropagation();
            }}>{children}</Stack>
        
      </div>
    </>
  , document.body)

}

export function SparkyPointsSection() {
  const {user} = useAuthContext();
  const { userPoints, userHistory, tasks, rewards } = useSparkyPoints();
  // TODO - pass user information

  const guideButtonRef = useRef<HTMLButtonElement>(null);
  
  const [modalState, setModalState] = useState<"redeem"|"denied"|null>(null);
  const [itemRedeemed, setItemRedeemed] = useState<null | RewardItem>(null);
  const [currentMobileSection, setCurrentMobileSection] = useState<mobileSections>("main");
  
  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }, [currentMobileSection]);

  const handleRedeemClick = (reward: RewardItem) => {
    setItemRedeemed(reward);
    if (reward.cost <= userPoints) {
      setModalState("redeem");
    }
    else {
      setModalState("denied");
    }
  }

  // TODO - Implement redeeming logic
  const onRewardRedeem = (item: RewardItem) => {}

  const isModalRedeem = modalState === "redeem";
  return (
      <>
        <div className="absolute w-full mt-20 z-0 lg:hidden">
          <img alt="ellipses" src={ASSETS.PROFILE.SPARKY_POINTS.ELLIPSES_SMALL} className="w-full absolute"/>
          <img alt="sparks" src={ASSETS.PROFILE.SPARKY_POINTS.SPARKS_SMALL} className="w-95/100 mx-auto absolute"/>
        </div>
        <div className="absolute w-full z-0 mt-28 hidden lg:block">
          <img alt="ellipses" src={ASSETS.PROFILE.SPARKY_POINTS.ELLIPSES_BIG} className="w-full absolute"/>
          <img alt="sparks" src={ASSETS.PROFILE.SPARKY_POINTS.SPARKS_BIG} className="w-1/2 left-1/2 transform-[translate(-45%,50%)] top- mx-auto absolute"/>
        </div>
        <Container className="pt-26 md:pt-38 bg-[#010B1D] pb-4 max-w-none">
          
          <Stack gap="md" className="lg:hidden relative z-1 md:px-12">
            {
              currentMobileSection === "main" && 
              <>
                <Stack gap="none" className="px-4 z-1">
                  <Text gradient="white-blue" variant="heading-5" align="center" weight="bold">
                    Sparky Points
                  </Text>
                  <Text variant="label" color="muted" align="center" className="w-full" >
                    Track your engagement. Celebrate your effort.
                  </Text>
                </Stack>
                <Stack gap="xl">
                  <PointsDisplay points={userPoints}/>
                  <Stack gap="xs">
                    <Text gradient="white-blue" variant="heading-6" weight="bold">
                      Quick Actions
                    </Text>
                    <Grid gap={"xs"} columns={3}>
                      <QuickAction text="Redeem Rewards" onNavigate={() => setCurrentMobileSection("redeem")}/>
                      <QuickAction text="How to Earn Points" onNavigate={() => setCurrentMobileSection("guide")}/>
                      <QuickAction text="Points History"  onNavigate={() => setCurrentMobileSection("history")}/>
                    </Grid>
                  </Stack>
                  <Stack gap="xs">
                    <div className="flex w-full justify-between items-center">
                      <Text gradient="white-blue" variant="heading-6" weight="bold">
                        Earn Points
                      </Text>
                      {/* TODO - Add link to all tasks */}
                      <a className="flex gap-4 items-center ">
                        <Text className="text-inherit">View All</Text>
                        <RightIconSvg/>
                      </a>
                    </div>
                    <Stack>
                      {tasks.map(task => <TaskItem key={task.id} {...task}/>)}
                    </Stack>
                  </Stack>
                </Stack>
              </>
            }
            {
              currentMobileSection === "redeem" &&
              <>
                <MobileSubHeader onGoBack={() => setCurrentMobileSection("main")} sectionTitle="Redeem Points" />
                <Stack gap="xl">
                  <PointsDisplay points={userPoints}/>
                  <Stack className="gap-1.5">
                    <div className="flex w-full justify-between items-center">
                      <Text gradient="white-blue" variant="heading-6" weight="bold">
                        Rewards
                      </Text>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button className="text-lg py-1 font-medium rounded-xl" iconRight={
                            DownChevronSvg()
                          }>
                            All
                          </Button>
                        </DropdownTrigger>
                        {/* TODO - Add filters */}
                        <DropdownContent position="bottom-end">
                          <DropdownItem>Test</DropdownItem>
                        </DropdownContent>
                      </Dropdown>
                    </div>
                    <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
                      {rewards.map(reward => <RewardItem key={reward.id} {...reward} onRedeem={() => handleRedeemClick(reward)}/>)}
                    </div>
                  </Stack>
                </Stack>
              </>
            }
            {
              currentMobileSection === "history" &&
              <>
                <MobileSubHeader onGoBack={() => setCurrentMobileSection("main")} sectionTitle="Points History" />
                <Stack gap="xl">
                  <PointsDisplay points={userPoints}/>
                  <Stack>
                    {userHistory.map(history => <HistoryItem key={`history-${history.data.id}`} avatar={user?.user_metadata.avatar_url} {...history}/>)}
                  </Stack>
                </Stack>
              </>
            }
            {
              currentMobileSection === "guide" &&
              <>
                <MobileSubHeader onGoBack={() => setCurrentMobileSection("main")} sectionTitle="How to Earn Points" />
                <Stack gap="xl">
                  <PointsDisplay points={userPoints}/>
                  <Stack>
                    {/* TODO - Add actual guides */}
                    <GuideItem title="Complete Tasks">Culpa cillum adipisicing cillum excepteur ut enim irure qui esse id ut excepteur officia. Sunt in non sunt quis eu tempor ad Lorem ipsum aute in culpa nisi. Amet laboris excepteur nulla irure exercitation ut incididunt do nulla adipisicing occaecat cupidatat adipisicing.</GuideItem>
                    <GuideItem title="Participate in Events">Aliqua tempor aute ex anim quis magna. Magna laboris nisi nostrud elit deserunt tempor sint officia nisi irure enim non. Adipisicing ut pariatur in aliqua ut nisi aute dolor officia. Velit velit ipsum ex culpa reprehenderit eiusmod labore proident laborum ullamco tempor dolor incididunt. Excepteur nisi duis pariatur consectetur dolor excepteur irure cupidatat culpa consectetur sint nostrud nulla ex. Amet fugiat esse aliquip sit in laboris consequat cillum nostrud deserunt irure aute ea.</GuideItem>
                    <GuideItem title="Take Bonus Challenges">Do voluptate qui esse ipsum amet ea culpa veniam voluptate aute et excepteur. Et aute sit fugiat officia ex nisi eu ad veniam. Id voluptate ullamco nisi tempor Lorem irure aliquip reprehenderit. Culpa enim minim dolore occaecat et commodo dolore non ad consequat commodo fugiat amet proident. Ex tempor exercitation commodo qui irure duis elit qui velit laboris enim id. Ex proident dolore sit nulla duis.</GuideItem>
                  </Stack>
                </Stack>
              </>
            }
          </Stack>  
          <div className="hidden lg:grid relative z-1 gap-6 grid-cols-3 max-w-288 left-0 right-0 m-auto px-16 pt-2 pb-4">
            <Stack className="col-span-2">
                <Stack gap="sm">
                  <Stack gap="none" className="z-1">
                    <Text gradient="white-blue" variant="heading-5" weight="bold">
                      Sparky Points
                    </Text>
                    <Text variant="body" color="muted" className="w-full" >
                      Track your engagement. Celebrate your effort.
                    </Text>
                  </Stack>
                  <PointsDisplay points={userPoints}/>
                </Stack>
                <Stack>
                  <div className="flex items-center justify-between">
                    <Text variant="heading-6" gradient="white-blue" weight="semibold">Rewards</Text>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button className="text-lg py-1 font-medium rounded-xl" iconRight={
                          <DownChevronSvg/>
                        }>
                          All
                        </Button>
                      </DropdownTrigger>
                      {/* TODO - Add filters */}
                      <DropdownContent position="bottom-end">
                        <DropdownItem>Test</DropdownItem>
                      </DropdownContent>
                    </Dropdown>
                  </div>
                  <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
                    {rewards.map(reward => <RewardItem key={reward.id} {...reward} onRedeem={() => handleRedeemClick(reward)}/>)}
                  </div>
                </Stack>
            </Stack>
            <Stack className="p-4" gap="sm">
              <div className="flex items-end justify-between">
                <Text variant="heading-6" gradient="white-blue" weight="semibold">Earn Points</Text>
                <div className="flex gap-2">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button ref={guideButtonRef} variant="colored" subVariant="blue" size="lg" iconLeft={
                        GuideIconSvg()
                      }/>
                    </DropdownTrigger>
                    <DropdownContent 
                      position="bottom-end" 
                      className={
                        cn(
                          GRADIENT_BORDER_BASE, 
                          "before:bg-[linear-gradient(0deg,#000_0%,#414141_100%)]", 
                          "absolute bg-[#010B1D] shadow-[0px_4px_11.8px_-1px_#00000040] overflow-visible max-h-none rounded-2xl w-100 px-2.5 py-4 gap-4 flex flex-col"
                        )
                      }
                    >
                      {/*  */}
                      <Text gradient="white-blue" weight="bold" align="center" className="text-xl">How to Earn Points</Text>
                      {/* TODO - Add actual guides */}
                      <Stack>
                        <GuideItem title="Complete Tasks" clamp={3}>Culpa cillum adipisicing cillum excepteur ut enim irure qui esse id ut excepteur officia. Sunt in non sunt quis eu tempor ad Lorem ipsum aute in culpa nisi. Amet laboris excepteur nulla irure exercitation ut incididunt do nulla adipisicing occaecat cupidatat adipisicing.</GuideItem>
                        <GuideItem title="Participate in Events" clamp={3}>Aliqua tempor aute ex anim quis magna. Magna laboris nisi nostrud elit deserunt tempor sint officia nisi irure enim non. Adipisicing ut pariatur in aliqua ut nisi aute dolor officia. Velit velit ipsum ex culpa reprehenderit eiusmod labore proident laborum ullamco tempor dolor incididunt. Excepteur nisi duis pariatur consectetur dolor excepteur irure cupidatat culpa consectetur sint nostrud nulla ex. Amet fugiat esse aliquip sit in laboris consequat cillum nostrud deserunt irure aute ea.</GuideItem>
                        <GuideItem title="Take Bonus Challenges" clamp={3}>Do voluptate qui esse ipsum amet ea culpa veniam voluptate aute et excepteur. Et aute sit fugiat officia ex nisi eu ad veniam. Id voluptate ullamco nisi tempor Lorem irure aliquip reprehenderit. Culpa enim minim dolore occaecat et commodo dolore non ad consequat commodo fugiat amet proident. Ex tempor exercitation commodo qui irure duis elit qui velit laboris enim id. Ex proident dolore sit nulla duis.</GuideItem>
                      </Stack>
                    </DropdownContent>
                  </Dropdown>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button aria-label="history" variant="colored" subVariant="blue" size="lg" iconLeft={
                        HistoryIconSvg()
                      }/>
                    </DropdownTrigger>
                    <DropdownContent 
                      position="bottom-end" 
                      className={
                        cn(
                          GRADIENT_BORDER_BASE, 
                          "before:bg-[linear-gradient(0deg,#000_0%,#414141_100%)]", 
                          "absolute bg-[#010B1D] shadow-[0px_4px_11.8px_-1px_#00000040] overflow-visible max-h-none rounded-2xl w-100 px-2.5 py-4 gap-4 flex flex-col"
                        )
                      }
                    >
                      <Text gradient="white-blue" weight="bold" align="center" className="text-xl">Points History</Text>  
                      <Stack>
                        {userHistory.map(history => <HistoryItem key={`historylg-${history.data.id}`} avatar={user?.user_metadata.avatar_url} {...history}/>)}
                      </Stack>
                    </DropdownContent>
                  </Dropdown>
                </div>
              </div>
              {tasks.map(task => <TaskItem key={task.id} {...task} />)}
            </Stack>
          </div>
        </Container>
        <Modal isOpen={modalState !== null} onClose={() => {
          setModalState(null);
          setItemRedeemed(null);
        }}>
          <div className="w-full aspect-square grid">
            {
              isModalRedeem
                ? (
                  <img src={ASSETS.PROFILE.SPARKY_POINTS.CIRBY_CONFIRM} alt="Confirm?" className="w-full h-full" />
                )
                : (
                  <img src={ASSETS.PROFILE.SPARKY_POINTS.CIRBY_DENIED} alt="Denied." className="w-full h-full" />
                )
            }
          </div>
          {
            isModalRedeem
              ? (
                <>
                  <Text gradient="white-blue" variant="heading-6" weight="bold" align="center">
                    Confirm Redemption
                  </Text>
                  <Text variant="body" align="center" className="text-inherit">
                    Redeem <strong>{itemRedeemed?.name}</strong> for <strong>{itemRedeemed?.cost}</strong> points? This action cannot be undone.
                  </Text>
                </>
              ) : (
                <>
                  <Text gradient="white-red" variant="heading-6" weight="bold" align="center">
                    Insufficient Points
                  </Text>
                  <Text variant="body" align="center" className="text-inherit">
                    Need <strong>{itemRedeemed?.cost ?? 0 - userPoints}</strong> more points.
                  </Text>
                </>
              )
          }
          <div className="flex gap-4 w-full">
            <Button subVariant="plain" className="grow m-auto" onClick={() => {
              setModalState(null);
              setItemRedeemed(null);
            }}>
              Cancel
            </Button>
            {
              isModalRedeem
                ? (
                  <Button variant="colored" subVariant="dark-blue" className="grow" onClick={() => {
                    const item = itemRedeemed!;
                    setModalState(null);
                    setItemRedeemed(null);
                    onRewardRedeem(item);
                  }}>
                    Redeem
                  </Button>
                ) : (
                <Button variant="colored" subVariant="dark-blue" className="grow" onClick={() => {
                  setModalState(null);
                  setItemRedeemed(null);
                  setCurrentMobileSection("guide");
                  guideButtonRef.current?.click()
                }}>
                  How to Earn
                </Button>
                )
            }
          </div>
        </Modal>
      </>
  );
}
