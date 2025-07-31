import Text from "@/components/ui/text/text";

export default function Home() {
  return (
    <>
      <Text
        animation="cascadeUp"
        as="h1"
        color="teal"
        size="2xl"
        className="text-center"
        staggerMs={12}
      >
        custom component :D
      </Text>
    </>
  );
}
