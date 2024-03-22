import {
    Page,
    FormLayout,
    TextField,
    Card,
    Form,
    BlockStack,
    Divider,
    Modal,
    InlineGrid,
    Button,
    Select,
    CalloutCard,
    InlineError, IndexTable, Loading
} from '@shopify/polaris';
import {useForm, Controller, useFieldArray} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    DeleteIcon
} from '@shopify/polaris-icons';
import {PlusCircleIcon} from "lucide-react";
import {toast} from "react-hot-toast";
import * as React from "react";
import {createDoc} from "./action.ts"
import {FormStateType, formSchema} from "./validation.ts"
import {DiscountTable} from "./_components/discount-table.tsx";
import DiscountList from "./pages/discount-list.tsx";
import {NonEmptyArray} from "@shopify/polaris/build/ts/src/types";
import {IndexTableHeading} from "@shopify/polaris/build/ts/src/components/IndexTable";


export  const resourceName = {
    singular: 'order',
    plural: 'orders',
};

function App() {
    const [open, setOpen] = React.useState(false)
    const [_,startTransition] = React.useTransition()
    const {formState:{errors},trigger, handleSubmit, control, watch, reset} = useForm<FormStateType>({
        resolver:zodResolver(formSchema),
        mode:"all"
    });
    const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
        control,
        name: 'option',
    });



    const onSubmit = (data:FormStateType) => {
        startTransition(() => {
                toast.promise(createDoc(data),{
                    loading:"Creating...",
                    success:() => {
                        reset();
                        setOpen(false);
                        console.log(_)
                        return "creat success"
                    },
                    error:"Creat fail"
                })
            })

    }
    const watchOption =  watch('option')

    const handleCreat = () => {
        appendOption(
            {
                option_title:"",
                subtitle: "",
                quantity:watchOption.length >0 ? Number(watchOption[watchOption.length-1]['quantity']) + 1 : 1,
                label:"",
                discount_type:"none",
                amount:1
            }
        )
    }



    const column =  watchOption && watchOption?.map(
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
                        {item.option_title}
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        {item.subtitle}
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        {item.quantity}
                    </IndexTable.Cell>

                    <IndexTable.Cell>{item.label}</IndexTable.Cell>
                    <IndexTable.Cell>
                        {item.discount_type === "percent" ?`% ${item.discount_type}`:item.discount_type === "each" ? `$ ${item.discount_type}`:item.discount_type }
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        {item.discount_type === "percent" ?`${item.amount} $`:item.discount_type === "each" ? ` ${item.amount} $`:item.amount }

                    </IndexTable.Cell>
                </IndexTable.Row>
            ),
        )

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const header:NonEmptyArray<IndexTableHeading> =[
        {title: 'Option title'},
        {title: 'Subtitle'},
        {title: 'Quantity'},
        {title: 'Label'},
        {title: 'Discount type'},
        {title: 'Amount'},
    ]

    console.log(_)
    return (
    <>

          <div className="grid grid-cols-3 relative">
              <div className="col-span-2">
                  <Form  onSubmit={handleSubmit(onSubmit)}>
                      <Page
                          backAction={{content: 'Products', url: '#'}}
                          title="Create volume discount"
                          secondaryActions={<button disabled={_}
                                                    onClick={async () => {
                                                        await trigger(["title", "option","campaign"])
                                                    }}
                                                    className={`text-white p-2 rounded-lg border-none ${!_? "bg-orange-500 cursor-pointer" : "bg-gray-200"}`} type="submit">
                              {_ ? <> <Loading /> Loading... </> :"Submit"}
                          </button>}
                      >
                          <FormLayout>
                              <Card>
                                  <div className="Polaris-LegacyStack__Item mb-3">
                                      <h5 className="Polaris-Text--root Polaris-Text--headingLg">General</h5>
                                  </div>
                                  <div className="space-y-3">
                                      <Controller
                                          name="campaign"
                                          defaultValue=""
                                          control={control}
                                          render={({ field }) => (
                                              <TextField label="Campaign"
                                                         autoComplete="off"
                                                         placeholder="Enter compain name"
                                                         error={errors.campaign?.message}
                                                         {...field}
                                              />
                                          )}
                                      />
                                      <Controller
                                          name="title"
                                          defaultValue=""
                                          control={control}
                                          render={({ field }) => (
                                              <TextField label="Title"
                                                         autoComplete="off"
                                                         placeholder="Enter compain name"
                                                         error={errors.title?.message}
                                                         {...field}
                                              />
                                          )}
                                      />

                                      <Controller
                                          name="desc"
                                          control={control}
                                          defaultValue=""
                                          render={({ field }) => (
                                              <TextField label="Description"
                                                         autoComplete="off"
                                                         placeholder="Enter compain name"
                                                         error={errors.desc?.message}
                                                         {...field}
                                              />
                                          )}
                                      />
                                  </div>
                              </Card>


                              <Card>
                                  <div className="sticky ">
                                      <BlockStack gap="500">
                                          <div className="Polaris-LegacyStack__Item">
                                              <h5 className="Polaris-Text--root Polaris-Text--headingLg">Volume discount rule</h5>
                                          </div>
                                          <Divider />
                                      </BlockStack>
                                  </div>
                                  {/* section */}
                                  <div className="space-y-20 relative max-h-[500px] overflow-y-scroll">
                                      {errors.option &&  <InlineError message={errors.option ?  errors.option.message as string:''} fieldID="myFieldID" />}
                                      {optionFields?.map((_, index) =>
                                          {
                                              return  (
                                                  <div key={index}  className=" rounded-md relative ">
                                                      <div className=" relative h-auto min-h-40">
                                                          <div className="relative border border-red-600">
                                                              <div id="section_no" className="absolute w-32 uppercase rounded-br-2xl bg-orange-500 text-white   p-2">
                                                                  option { index + 1}
                                                              </div>
                                                              <div className="relative top-10 p-5">
                                                                  <Modal

                                                                      open={open}
                                                                      onClose={() => setOpen(!open)}
                                                                      title="Delete this rule ?"
                                                                      activator={
                                                                          <>
                                                                              <div className="flex justify-end cursor-pointer">
                                                                                  <DeleteIcon className="w-5 h-5" onClick={() => {
                                                                                      setOpen(true);
                                                                                  }}  />
                                                                              </div>
                                                                          </>
                                                                      }
                                                                  >
                                                                      <Modal.Section>

                                                                          <InlineGrid gap="400" columns={2}>
                                                                              <Button variant="plain" tone="critical" onClick={() => setOpen(false)}>Cancel</Button>
                                                                              <Button  variant="primary" onClick={() => {
                                                                                  removeOption(index);
                                                                                  setOpen(false)
                                                                              }}>Delete</Button>
                                                                          </InlineGrid>
                                                                      </Modal.Section>
                                                                  </Modal>

                                                                  <div className="grid grid-cols-3 gap-5">
                                                                      <Controller
                                                                          name={`option.${index}.option_title`}
                                                                          control={control}
                                                                          defaultValue=""
                                                                          render={({ field }) => (
                                                                              <TextField label="option_title"
                                                                                         autoComplete="off"
                                                                                         placeholder="Enter Subtitle"
                                                                                         {...field}
                                                                                         error={errors.option ?( errors.option[index] as {option_title:{message:string}})?.option_title.message :""}

                                                                              />
                                                                          )}
                                                                      />
                                                                      <Controller
                                                                          name={`option.${index}.subtitle`}
                                                                          control={control}
                                                                          defaultValue=""
                                                                          render={({ field }) => (
                                                                              <TextField label="Subtitle"
                                                                                         autoComplete="off"
                                                                                         placeholder="Enter Subtitle"
                                                                                         {...field}
                                                                              />
                                                                          )}
                                                                      />
                                                                      <Controller
                                                                          name={`option.${index}.quantity`}
                                                                          control={control}
                                                                          render={({ field }) => (
                                                                              <TextField
                                                                                  {...field}
                                                                                  label="Quantity"
                                                                                  autoComplete="off"
                                                                                  placeholder="Enter quantity"
                                                                                  type="number"
                                                                                  min={1}
                                                                                  value={field.value ? field.value.toString(): ''}
                                                                                  onChange={field.onChange}
                                                                                  error={errors.option ?( errors.option[index] as {quantity:{message:string}})?.quantity?.message :""}
                                                                              />
                                                                          )}
                                                                      />
                                                                      <Controller
                                                                          name={`option.${index}.label`}
                                                                          control={control}
                                                                          render={({ field }) => (
                                                                              <TextField
                                                                                  {...field}
                                                                                  label={"label"}
                                                                                  type="text"
                                                                                  autoComplete="off"
                                                                                  placeholder="Enter label"
                                                                              />
                                                                          )}
                                                                      />
                                                                      <Controller
                                                                          name={`option.${index}.discount_type`}
                                                                          control={control}
                                                                          render={({ field }) => (
                                                                              <Select
                                                                                  {...field}
                                                                                  label={`Discount type`}
                                                                                  options={[
                                                                                      { label: 'None', value: 'none' },
                                                                                      { label: 'Percent', value: 'percent' },
                                                                                      { label: 'Each', value: 'each' }
                                                                                  ]}

                                                                              />
                                                                          )}
                                                                      />
                                                                      {watchOption && (watchOption[index]['discount_type'] == 'percent' || watchOption[index]['discount_type'] == 'each') && (
                                                                          <Controller
                                                                              name={`option.${index}.amount`}
                                                                              control={control}
                                                                              render={({ field }) => (

                                                                                  <TextField
                                                                                      label="amount"
                                                                                      type="number"
                                                                                      value={field.value ? field.value.toString(): ''}
                                                                                      onChange={field.onChange}
                                                                                      suffix={`${watchOption[index]['discount_type'] == 'percent' ? '%' : '$'}`}
                                                                                      autoComplete="off"
                                                                                      min={1}
                                                                                  />
                                                                              )}
                                                                          />
                                                                      )}
                                                                  </div>

                                                              </div>
                                                          </div>
                                                      </div>
                                                  </div>
                                              )
                                          }

                                      )}
                                      <button type="button"  className="sticky bottom-0 z-30 cursor-pointer bg-orange-500 text-white border-none flex items-center p-2 rounded-md w-full justify-center "
                                              onClick={handleCreat}>
                                          <PlusCircleIcon className="mr-2 w-4 h-4 text-white"/>  Add Option
                                      </button>
                                  </div>

                              </Card>
                          </FormLayout>

                      </Page>

                  </Form>
              </div>
              <div className="relative top-[5rem] mr-5 space-y-3">
                  <Card >
                      <div className="Polaris-LegacyStack__Item my-3">
                          <h5 className="Polaris-Text--root Polaris-Text--headingLg">Preview</h5>
                      </div>
                        <div className="text-center my-3">
                            <div className="Polaris-LegacyStack__Item">
                                <h6 className="Polaris-Text--root Polaris-Text--headingMd">Buy more and save</h6>
                            </div>
                        </div>
                      <p>Apply for all products in store</p>
                      <div id="content">
                          {watchOption && watchOption.length > 0 ? (
                              <DiscountTable
                                  data={watchOption}
                                  mode="preview"
                                  resourceName={resourceName}
                                  column={column}
                                  header={header}
                              />
                          ):(
                              <div className="my-5">
                                  <CalloutCard
                                      title="Your rule is empty.Create Now !!"
                                      illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                                      primaryAction={{content: 'Create',onAction() {
                                              handleCreat()
                                          }}}
                                  >
                                  </CalloutCard>

                              </div>
                          )}
                      </div>
                  </Card>

              </div>
          </div>
        <div className="my-5 p-5">
            <DiscountList />
        </div>

    </>
  )
}

export default App;
