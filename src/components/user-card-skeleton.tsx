import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function UserCardSkeleton() {
  return (
    <Card className="glowing-card-content flex flex-col h-full bg-card/95 backdrop-blur-sm shadow-lg border-transparent">
      <CardHeader className="flex flex-col items-center text-center p-6">
        <Skeleton className="h-20 w-20 rounded-full mb-3" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent className="p-6 pt-0 flex-grow space-y-4">
        <div className="text-center space-y-2">
            <Skeleton className="h-3 w-1/4 mx-auto" />
            <div className="flex flex-wrap gap-1.5 justify-center">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
            </div>
        </div>
        <div className="flex items-center justify-center text-muted-foreground">
            <hr className="w-8 border-border" />
            <Skeleton className="h-4 w-4 mx-2 rounded-full" />
            <hr className="w-8 border-border" />
        </div>
        <div className="text-center space-y-2">
            <Skeleton className="h-3 w-1/4 mx-auto" />
            <div className="flex flex-wrap gap-1.5 justify-center">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 grid grid-cols-2 gap-2">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}
