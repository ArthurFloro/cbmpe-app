import { SafeAreaView } from 'react-native-safe-area-context';
import Routes from './src/routes';
import { Provider as PaperProvider } from 'react-native-paper';


export default function App() {
  return (
    <PaperProvider>
      <SafeAreaView style={{flex: 1}}>
        <Routes/>
      </SafeAreaView>
    </PaperProvider>
  );
}


