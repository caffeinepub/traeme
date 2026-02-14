import { teamMembers } from '../content/team';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">About Traeme</h1>
        <p className="text-muted-foreground mt-2">
          Safe and reliable school transportation for Politécnico Reverendo Andrés Amengual Fe y Alegría
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Traeme is dedicated to providing a safe, efficient, and transparent school transportation system for
            students, parents, and staff at Politécnico Reverendo Andrés Amengual Fe y Alegría in Jima Arriba, La
            Vega, Dominican Republic. Our platform enables real-time tracking, communication, and coordination to
            ensure every student arrives safely at school and home.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Meet the Team</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {teamMembers.map((member) => (
            <Card key={member.id}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
