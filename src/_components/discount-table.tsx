
import {IndexTable, useIndexResourceState} from "@shopify/polaris";
import {NonEmptyArray} from "@shopify/polaris/build/ts/src/types";
import {IndexTableHeading} from "@shopify/polaris/build/ts/src/components/IndexTable";

interface IDiscountTable{
    mode:"preview" | "list",
    resourceName: {singular: string, plural: string},
    data:unknown[] ,
    column: JSX.Element[],
    header:NonEmptyArray<IndexTableHeading>
}

export function DiscountTable(props:IDiscountTable) {



    const {selectedResources, allResourcesSelected, handleSelectionChange} =  useIndexResourceState(props.data as never[]);

    return (
        <>
            {props.data && (
                <IndexTable
                    resourceName={props?.resourceName}
                    itemCount={props?.data?.length}
                    selectedItemsCount={
                        allResourcesSelected ? 'All' : selectedResources?.length
                    }
                    onSelectionChange={handleSelectionChange}
                    headings={props?.header}
                >
                    {props.column}
                </IndexTable>
            )}

        
        </>
    )
}