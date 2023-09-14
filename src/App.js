import React  from "react";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider } from "baseui";
import TabComponent from "./components/tabs/Tabs";
import { Avatar } from "baseui/avatar";

const engine = new Styletron();

function App() {
  const bodyStyle = {
    margin: "20px",
  }

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <div className="App" style={bodyStyle}>
          <h1>Task Manager</h1>
          {/* <Avatar
            name="Jane Doe"
            size="scale1600"
            src="https://avatars.dicebear.com/api/human/yard.svg?width=285&mood=happy"
          /> */}
          <TabComponent />
        </div>
      </BaseProvider>
    </StyletronProvider>
  );
}

export default App;
