import TraderFeed from '../components/TraderFeed';
import Hero from "./components/Hero";
import Container from "./components/Container";


const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
            <Hero />
      <Container>
      </Container>
      <TraderFeed />
    </div>
  );
}
export default HomePage;