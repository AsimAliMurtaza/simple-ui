import Input from "@/components/ui/input";
import Text from "@/components/ui/text";

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
      <div className="flex flex-col items-center gap-6 p-24">
        <Input
          label="Email"
          variant="default"
          type="email"
          labelAnimate
        />
        <Input
          label="Password"
          type="password"
          variant="default"
          labelAnimate
        />
      </div>
    </>
  );
}
