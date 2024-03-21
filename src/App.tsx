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
    IndexTable,
    useIndexResourceState,
    CalloutCard,
    InlineError
} from '@shopify/polaris';
import {useForm, Controller, useFieldArray} from "react-hook-form";
import z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {
    DeleteIcon
} from '@shopify/polaris-icons';
import {PlusCircleIcon} from "lucide-react";
import {toast} from "react-hot-toast";
import { addDoc, collection } from "firebase/firestore";

import {  db } from "./firebase.ts";
import * as React from "react";




const formSchema= z.object({
    campaign: z.string().min(5, {message:"campaign must at least 5 character"}).trim(),
    desc:z.string().optional(),
    title:z.string().min(5, {message:"campaign must at least 5 character"}).trim(),
    option:z.array(
        z.object({
            option_title:z.string().min(2,{message:"option_title must at least 5 character"} ),
            subtitle:z.string().optional(),
            quantity:z
                .coerce
                .number(),
            label:z.string().optional(),
            discount_type: z.enum(['none', 'percent','each']).optional(),
            amount:z
                .coerce    // SOLUTION
                .number().optional()
        })
    ).nonempty()
})


type FormStateType = z.infer<typeof formSchema>

async function createDoc(data:FormStateType) {
  return  await addDoc(collection(db, "discount"), {
        data,
        uid: '1'
    })
}
function App() {
    const [open, setOpen] = React.useState(false)
    const [_,startTransition] = React.useTransition()
    const {formState:{errors},handleSubmit, control, watch, reset} = useForm<FormStateType>({
        resolver:zodResolver(formSchema),
        mode:"all"
    });

    const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
        control,
        name: 'option',
    });


    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };

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
    const {selectedResources, allResourcesSelected, handleSelectionChange} =
        useIndexResourceState(watchOption);

    const rowMarkup = watchOption && watchOption?.map(
        (
            {
                option_title,
                subtitle,
                quantity,
                label,
                discount_type,
                amount
            },
            index,
        ) => (
            <IndexTable.Row
                id={index.toString()}
                key={index}
                selected={selectedResources.includes(index.toString())}
                position={index}
            >
                <IndexTable.Cell>

                        {option_title}
                </IndexTable.Cell>
                <IndexTable.Cell>
                        {subtitle}
                </IndexTable.Cell>
                <IndexTable.Cell>
                        {quantity}
                </IndexTable.Cell>
                <IndexTable.Cell>{label}</IndexTable.Cell>
                <IndexTable.Cell>{discount_type === "percent" ? `% ${discount_type}`:discount_type }</IndexTable.Cell>
                <IndexTable.Cell>{discount_type === "percent" ? `${amount} %`:amount }</IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

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



    return (
    <>

          <div className="grid grid-cols-3">
              <div className="col-span-2">
                  <Form  onSubmit={handleSubmit(onSubmit)}>

                      <Page
                          backAction={{content: 'Products', url: '#'}}
                          title="Create volume discount"
                          secondaryActions={<button className="bg-orange-500 text-white p-2 cursor-pointer rounded-lg border-none" type="submit">Save</button>}
                      >
                          <FormLayout>
                              <Card>



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
                                  <div className="relative">
                                      <BlockStack gap="500">
                                          <div className="Polaris-LegacyStack__Item relative">
                                              <h4 className="Polaris-Text--root Polaris-Text--headingXl">
                                                  Volume discount rule
                                              </h4>
                                          </div>
                                          <Divider />
                                      </BlockStack>
                                  </div>
                                  {/* section */}
                                  <div className="space-y-20 border-4">
                                      {errors.option &&  <InlineError message={errors.option ?  errors.option.message as string:''} fieldID="myFieldID" />}
                                      {optionFields?.map((_, index) =>
                                          {
                                              return  (
                                                  <div key={index}  className=" rounded-md relative border border-red-600">
                                                      <div className=" relative border h-auto min-h-40">
                                                          <div className="relative ">
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
                                                                      {watchOption && watchOption[index]['discount_type'] == 'percent' && (
                                                                          <Controller
                                                                              name={`option.${index}.amount`}
                                                                              control={control}
                                                                              render={({ field }) => (

                                                                                  <TextField
                                                                                      label="amount"
                                                                                      type="number"
                                                                                      value={field.value ? field.value.toString(): ''}
                                                                                      onChange={field.onChange}
                                                                                      suffix="%"
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
                                      <button type="button"  className=" cursor-pointer bg-orange-500 text-white border-none flex items-center p-2 rounded-md w-full justify-center "
                                              onClick={handleCreat}>
                                          <PlusCircleIcon className="mr-2 w-4 h-4 text-white"/>  Add Option
                                      </button>
                                  </div>

                              </Card>
                          </FormLayout>

                      </Page>

                  </Form>
              </div>
              <div>
                  <Card >
                      <div className="Polaris-LegacyStack__Item">
                          <h5 className="Polaris-Text--root Polaris-Text--headingLg">Preview</h5>
                      </div>

                      <div id="content">
                          {watchOption && watchOption.length > 0 ? (
                              <IndexTable
                                  resourceName={resourceName}
                                  itemCount={watchOption.length}
                                  selectedItemsCount={
                                      allResourcesSelected ? 'All' : selectedResources.length
                                  }
                                  onSelectionChange={handleSelectionChange}
                                  headings={[
                                      {title: 'option_title'},
                                      {title: 'subtitle'},
                                      {title: 'quantity'},
                                      {title: 'label'},
                                      {title: 'discount_type'},
                                      {title: 'amount'},
                                  ]}
                              >
                                  {rowMarkup}
                              </IndexTable>
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
    </>
  )
}

export default App;
