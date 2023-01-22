import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { Alert, ScrollView, Text, View } from "react-native";

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { Loading } from "../components/Loading";

import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { api } from "../lib/axios";
import dayjs from "dayjs";
import { EmptyHabits } from "../components/EmptyHabits";
import clsx from "clsx";

interface Params {
  date: string;
}

interface DayInfoProps {
  completedHabits: string[];
  possibleHabits: {
    id: string;
    title: string;
  }[];
}

export function Habit() {
  const [loading, setLoading] = useState(false);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const route = useRoute();
  const { date } = route.params as Params;

  const parsedDate = dayjs(date);
  const isPastDate = parsedDate.endOf("day").isBefore(new Date());
  const dayOfTheWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");

  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(
        dayInfo?.possibleHabits.length,
        completedHabits.length
      )
    : 0;

  useEffect(() => {
    fetchHabits();
  }, []);

  async function handleToggleHabits(habitId: string) {
    if (completedHabits.includes(habitId)) {
      setCompletedHabits((prevState) =>
        prevState.filter((id) => id !== habitId)
      );
    } else {
      setCompletedHabits((prevState) => [...prevState, habitId]);
    }
    try {
      await api.patch(`habits/${habitId}/toggle`);
    } catch (err) {
      Alert.alert("Ops", "Não foi possível atualizar o hábito");
      console.log(err);
    }
  }

  async function fetchHabits() {
    try {
      setLoading(true);
      const res = await api.get("day", { params: { date } });
      setDayInfo(res.data);
      setCompletedHabits(res.data.completedHabits);
    } catch (err) {
      Alert.alert("Ops", "Não foi possível carregar os hábitos");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <View className="flex-1 bg-background px-8 pt-16 ">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />
        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfTheWeek}
        </Text>
        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View
          className={clsx("mt-6", {
            ["opacity-50"]: isPastDate,
          })}
        >
          {dayInfo?.possibleHabits ? (
            dayInfo?.possibleHabits.map((habit) => (
              <Checkbox
                key={habit.id}
                title={habit.title}
                checked={completedHabits.includes(habit.id)}
                disabled={isPastDate}
                onPress={() => handleToggleHabits(habit.id)}
              ></Checkbox>
            ))
          ) : (
            <EmptyHabits />
          )}
        </View>
        {isPastDate && (
          <Text className="text-white mt-10 text-center">
            Você não pode alterar um hábito passado
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
