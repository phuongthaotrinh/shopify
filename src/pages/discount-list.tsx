import {useEffect} from "react";
import {collection, onSnapshot, query} from "firebase/firestore";
import {db} from "../firebase.ts";
import {Discount} from "../validation.ts";
import * as React from "react";
import {Card, IndexTable} from '@shopify/polaris';
import {DiscountTable} from "../_components/discount-table.tsx";
import {resourceName} from "../App.tsx"
import {NonEmptyArray} from "@shopify/polaris/build/ts/src/types";
import {IndexTableHeading} from "@shopify/polaris/build/ts/src/components/IndexTable";


export default function DiscountList () {
    const [data, setData] = React.useState<Discount[]>([]);

    useEffect(() => {
        const q = query(  collection(db, "discount"));
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const fetchedMessages:Discount[] = [];
            QuerySnapshot.forEach((doc) => {
                const data={id:doc.id, ...doc.data()} as Discount
                fetchedMessages.push(data)
            });
            setData(fetchedMessages);
        });
        return () => unsubscribe()
    }, []);
    console.log("data",data)
    const column =  data && data?.map(
        (
            item,
            index,
        ) => (
            <IndexTable.Row
                id={index.toString()}
                key={index}
                position={index}
            >
                <IndexTable.Cell>
                    {item.title}
                </IndexTable.Cell>
                <IndexTable.Cell>
                    {item.campaign}
                </IndexTable.Cell>
                <IndexTable.Cell>
                    {item.desc}
                </IndexTable.Cell>
                <IndexTable.Cell>
                    {item.option.length}
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const header:NonEmptyArray<IndexTableHeading> =[
        {title: 'campaign'},
        {title: 'title'},
        {title: 'desc'},
        { title:"option"  }
    ]
    return (
        <div className="">
            <Card>

                <DiscountTable mode="list" resourceName={resourceName} data={data} column={column} header={header} />



            </Card>

        </div>
    )
}