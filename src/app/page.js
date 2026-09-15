import Image from "next/image";
import Button from "@/components/buttons/Button";

export default function Home() {
  return (
    <div>
    <div className="flex flex-col flex-1 items-center justify-center font-mono bg-primary-00 h-dvh">
      <p className="by-lg">fhdusidlsa</p>
      <Button copy="sarasa" url="https://sarasa" variant="primary"/>
    </div>
    <div className="h-dvh">
      <p className="text-black font-sans">test</p>  
       <Button copy="sarasa" url="https://sarasa" variant="secondary"/>  
       <Button copy="sarasa" url="https://sarasa" variant="tertiary"/>  
      </div>
    </div>
  );
}
