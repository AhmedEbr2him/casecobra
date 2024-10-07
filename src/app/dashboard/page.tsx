import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { db } from '@/db';
import { formatePrice } from '@/lib/utils';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { notFound } from 'next/navigation';
import StatusDropDown from './Status';

const Page = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user.email !== process.env.ADMIN_EMAIL) {
        return notFound(); // or redirect("/") to home;
    }
    const orders = await db.order.findMany({
        where: {
            isPaid: true,
            createdAt: {
                gte: new Date(new Date().setDate(new Date().getDate() - 7)), // gte -> greater than or equal last week
            },
        },
        orderBy: {
            createdAt: 'asc',
        },
        include: {
            user: true,
            shippingAddress: true,
        },
    });

    const lastWeekSum = await db.order.aggregate({
        where: {
            isPaid: true,
            createdAt: {
                gte: new Date(new Date().setDate(new Date().getDate() - 7)),
            },
        },
        _sum: {
            amount: true,
        },
    });
    const lastMonthSum = await db.order.aggregate({
        where: {
            isPaid: true,
            createdAt: {
                gte: new Date(new Date().setDate(new Date().getDate() - 30)),
            },
        },
        _sum: {
            amount: true,
        },
    });

    const WEEKLY_GOAL = 500;
    const MONTH_GOAL = 2500;
    return (
        <div className='flex min-h-screen w-full bg-muted/40'>
            <div className='max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4'>
                <div className='flex flex-col gap-16'>
                    <div className='grid gap-4 sm:grid-cols-2'>
                        <Card>
                            <CardHeader className='pb-2'>
                                <CardDescription>Last week</CardDescription>
                                <CardTitle className='text-4xl'>
                                    {formatePrice(lastWeekSum._sum.amount ?? 0)}
                                </CardTitle>
                                <CardContent className=''>
                                    <div className='text-sm text-muted-foreground'>
                                        of {formatePrice(WEEKLY_GOAL)}
                                    </div>
                                </CardContent>
                            </CardHeader>

                            <CardFooter className=''>
                                <Progress
                                    value={((lastWeekSum._sum.amount ?? 0) * 100) / WEEKLY_GOAL}
                                />
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className='pb-2'>
                                <CardDescription>Last month</CardDescription>
                                <CardTitle className='text-4xl'>
                                    {formatePrice(lastWeekSum._sum.amount ?? 0)}
                                </CardTitle>
                                <CardContent>
                                    <div className='text-sm text-muted-foreground'>
                                        of {formatePrice(MONTH_GOAL)}
                                    </div>
                                </CardContent>
                            </CardHeader>

                            <CardFooter>
                                <Progress
                                    value={((lastMonthSum._sum.amount ?? 0) * 100) / MONTH_GOAL}
                                />
                            </CardFooter>
                        </Card>
                    </div>
                    <h1 className='text-4xl font-bold tracking-tight'>Incoming orders</h1>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead className='hidden sm:table-cell'>Status</TableHead>
                                <TableHead className='hidden sm:table-cell'>
                                    Purchase date
                                </TableHead>
                                <TableHead className='text-right'>amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map(order => (
                                <TableRow
                                    key={order.id}
                                    className='bg-accent'
                                >
                                    <TableCell>
                                        <div className='font-medium'>
                                            {order.shippingAddress?.name}
                                        </div>
                                        <div className='hidden text-sm text-muted-foreground sm:inline'>
                                            {order.user.email}
                                        </div>
                                    </TableCell>
                                    <TableCell className='hidden sm:table-cell'>
                                        <StatusDropDown
                                            id={order.id}
                                            orderStatus={order.status}
                                        />
                                    </TableCell>
                                    <TableCell className='hidden sm:table-cell'>
                                        {order.createdAt.toLocaleDateString('en')}
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        {formatePrice(order.amount)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};
export default Page;
