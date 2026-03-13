/* eslint-disable @next/next/no-img-element */
"use client";

import { ASSETS } from "@/lib/constants/assets";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/providers/AuthProvider";
import {  Button, Container, Dropdown, DropdownContent, DropdownItem, DropdownTrigger, Grid, Stack, Text } from "@packages/spark-ui";
import { useEffect, useRef, useState } from "react";
import { useSparkyPoints } from "../hooks/useSparkyPoints";
import { RightIconSvg } from "../icons/RightIconSvg";
import { DownChevronSvg } from "../icons/DownChevronSvg";
import { HistoryIconSvg } from "../icons/HistoryIconSvg";
import { GuideIconSvg } from "../icons/GuideIconSvg";
import { PointsDisplay } from "./PointsDisplay";
import { MobileSubHeader } from "./MobileSubHeader";
import { QuickAction } from "./QuickAction";
import { TaskItem } from "./TaskItem";
import { RewardItem } from "./RewardItem";
import { GuideItem } from "./GuideItem";
import { HistoryItem } from "./HistoryItem";
import { RewardItemType } from "../types";
import { Modal } from "../../../components/shared/Modal";

type mobileSections = "main" | "guide" | "redeem" | "history";

const GRADIENT_BORDER_BASE = "relative isolate before:content-[''] before:absolute before:-inset-px before:rounded-[inherit] before:p-px before:bg-size-[100%_100%] before:pointer-events-none before:z-[-1] before:mask-[linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] before:[mask-origin:content-box,border-box] before:[mask-clip:content-box,border-box] before:mask-exclude";
const RAINBOW_GRADIENT_COLOR = "before:bg-[linear-gradient(to_bottom_right,#FB2C36_0%,#F0B100_5%,#00C950_10%,#2B7FFF_15%,#FFFFFF_50.48%,#2B7FFF_85%,#00C950_90%,#F0B100_95%,#FB2C36_100%)]";
export const RAINBOW_BORDER = cn(GRADIENT_BORDER_BASE, RAINBOW_GRADIENT_COLOR);

export function SparkyPointsSection() {
  const {user} = useAuthContext();
  const { userPoints, userHistory, tasks, rewards } = useSparkyPoints();
  // TODO - pass user information

  const guideButtonRef = useRef<HTMLButtonElement>(null);
  
  const [modalState, setModalState] = useState<"redeem"|"denied"|null>(null);
  const [itemRedeemed, setItemRedeemed] = useState<null | RewardItemType>(null);
  const [currentMobileSection, setCurrentMobileSection] = useState<mobileSections>("main");
  
  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }, [currentMobileSection]);

  const handleRedeemClick = (reward: RewardItemType) => {
    setItemRedeemed(reward);
    if (reward.cost <= userPoints) {
      setModalState("redeem");
    }
    else {
      setModalState("denied");
    }
  }

  const closeModal = () => {
    setModalState(null);
    setItemRedeemed(null);
  }

  // TODO - Implement redeeming logic
  const onRewardRedeem = (item: RewardItemType) => {}

  const isModalRedeem = modalState === "redeem";
  return (
      <>
        <div className="absolute w-full mt-20 z-0 lg:hidden">
          <img alt="ellipses" src={ASSETS.SPARKY_POINTS.ELLIPSES_SMALL} className="w-full absolute"/>
          <img alt="sparks" src={ASSETS.SPARKY_POINTS.SPARKS_SMALL} className="w-95/100 mx-auto absolute"/>
        </div>
        <div className="absolute w-full z-0 mt-28 hidden lg:block">
          <img alt="ellipses" src={ASSETS.SPARKY_POINTS.ELLIPSES_BIG} className="w-full absolute"/>
          <img alt="sparks" src={ASSETS.SPARKY_POINTS.SPARKS_BIG} className="w-1/2 left-1/2 transform-[translate(-45%,50%)] top- mx-auto absolute"/>
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
                        <DropdownTrigger asChild>
                          <Button className="text-lg py-1 font-medium rounded-xl" iconRight={<DownChevronSvg/>}>
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
                      <DropdownTrigger asChild>
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
                    <DropdownTrigger asChild>
                      <Button ref={guideButtonRef} variant="colored" subVariant="blue" size="lg">
                        <GuideIconSvg/>
                      </Button>
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
                    <DropdownTrigger asChild>
                      <Button aria-label="history" variant="colored" subVariant="blue" size="lg">
                        <HistoryIconSvg/>
                      </Button>  
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
        <Modal isOpen={modalState !== null} onClose={closeModal}>
          <div className="w-full aspect-square grid">
            {
              isModalRedeem
                ? (
                  <img src={ASSETS.SPARKY_POINTS.CIRBY_CONFIRM} alt="Confirm?" className="w-full h-full" />
                )
                : (
                  <img src={ASSETS.SPARKY_POINTS.CIRBY_DENIED} alt="Denied." className="w-full h-full" />
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
                    Need <strong>{(itemRedeemed?.cost ?? 0) - userPoints}</strong> more points.
                  </Text>
                </>
              )
          }
          <div className="flex gap-4 w-full">
            <Button subVariant="plain" className="grow m-auto" onClick={closeModal}>
              Cancel
            </Button>
            {
              isModalRedeem
                ? (
                  <Button variant="colored" subVariant="dark-blue" className="grow" onClick={() => {
                    const item = itemRedeemed!;
                    closeModal();
                    onRewardRedeem(item);
                  }}>
                    Redeem
                  </Button>
                ) : (
                <Button variant="colored" subVariant="dark-blue" className="grow" onClick={() => {
                  closeModal();
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
