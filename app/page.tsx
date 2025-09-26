import { RootProviders } from './root';
import HomePageContent from './home/page';

export default function HomePage() {
  return (
    <RootProviders>
      <HomePageContent />
    </RootProviders>
  );
}
