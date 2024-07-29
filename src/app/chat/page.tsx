import { MaxWidthContainer } from "~/lib/ui/max-width-container";
import { UserInput } from "./_components/user-input";

export default async function Chat() {
  return (
    <>
      <div className="flex flex-1 flex-col overflow-auto">
        <MaxWidthContainer className="flex flex-1 flex-col"></MaxWidthContainer>
      </div>
      <MaxWidthContainer>
        <UserInput />
      </MaxWidthContainer>
    </>
  );
}
