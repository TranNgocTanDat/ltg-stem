import Header from "@/layout/Header/Header";
import BlocklyEditor from "./BlockyEditor";


export default function BlocklyPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <BlocklyEditor />
            </main>
        </div>
    );
}
