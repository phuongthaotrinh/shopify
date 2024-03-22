import z from "zod";

export const formSchema= z.object({
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


export type FormStateType = z.infer<typeof formSchema>

export interface Discount extends FormStateType {
    id: string
}