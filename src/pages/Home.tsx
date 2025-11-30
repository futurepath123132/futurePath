import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Search, BookOpen, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ScrollingUniIcons from "@/components/ScrollingUniIcons";
import Breadcrumbs from '@/components/Breadcrumbs';

export default function Home() {

     const uniImages = [
          "/uni-icons/lums_logo.png",
          "/uni-icons/uet-lahore-seeklogo.png",
          "/uni-icons/pu_icon.svg",
          "/uni-icons/cuiLogo.png",
          "/uni-icons/forman.png",
          "/uni-icons/nustLogo.png",
          "/uni-icons/fastLogo.png",
          "/uni-icons/BZULogo.jpg",


          
        ]


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
       <Breadcrumbs />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-background z-0" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Discover Your Future Path
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore universities and scholarships across Punjab, Pakistan. Your journey to higher education starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/universities">
                <Button size="lg" className="w-full sm:w-auto">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Explore Universities
                </Button>
              </Link>
              <Link to="/scholarships">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Star className="mr-2 h-5 w-5" />
                  Find Scholarships
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Future Path makes it easy to find and compare universities and scholarships
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <Search className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Smart Search</CardTitle>
                <CardDescription>
                  Filter universities by city, programs, tuition range, and more to find your perfect match
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Comprehensive Info</CardTitle>
                <CardDescription>
                  Access detailed information about universities including programs, fees, and contact details
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Star className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Save Favorites</CardTitle>
                <CardDescription>
                  Bookmark universities and scholarships to build your personalized list of opportunities
                </CardDescription>
              </CardHeader>
            </Card>


          </div>
        
          <div className="flex justify-center mt-10">
            <ScrollingUniIcons images={uniImages} />
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Ready to Start Your Journey?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of students discovering their path to higher education
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  Get Started
                </Button>

              <Link to="/universities">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Browse Universities
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

     
    </div>
  );
}
