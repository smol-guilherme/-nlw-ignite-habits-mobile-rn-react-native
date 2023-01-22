import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, View, ScrollView, Alert } from "react-native";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Loading } from "../components/Loading";
import { Header } from "../components/Header";
import { api } from "../lib/axios";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const datesFromYearStart = generateDatesFromYearBeginning();
const minimumSummaryDatesSize = 13 * 7;
const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length;

export function Home() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const { navigate } = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await api.get("summary");
      setSummary(res.data);
    } catch (err) {
      Alert.alert("Ops", "Não foi possível carregar o sumário de hábitos");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <View className="flex-1 bg-background px-8 py-16">
      <Header />
      <View className="flex-row mt-6 mb-2">
        {weekDays.map((weekDay, i) => (
          <Text
            key={`${weekDay}-${i}`}
            className="text-zinc-400 font-bold text-xl mx-1 text-center"
            style={{ width: DAY_SIZE, height: DAY_SIZE }}
          >
            {weekDay}
          </Text>
        ))}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row flex-wrap">
          {datesFromYearStart.map((date) => (
            <HabitDay
              key={date.toISOString()}
              onPress={() => navigate("habit", { date: date.toISOString() })}
            />
          ))}
          {amountOfDaysToFill > 0 &&
            Array.from({ length: amountOfDaysToFill }).map((_, i) => (
              <View
                key={i}
                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                style={{ width: DAY_SIZE, height: DAY_SIZE }}
              />
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
