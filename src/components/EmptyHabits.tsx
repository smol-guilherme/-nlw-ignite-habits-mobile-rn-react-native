import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native";

export function EmptyHabits() {
  const { navigate } = useNavigation();
  return (
    <Text className="to-zinc-400 text-base">
      Você ainda não cadastrou nenhum hábito.
      <Text
        className="text-violet-400 text-base underline active:text-violet-500"
        onPress={() => navigate("new")}
      >
        Cadastre um.
      </Text>
    </Text>
  );
}
