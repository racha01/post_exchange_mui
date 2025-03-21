import { ExcelSchemaBuilder, TransformersMap } from '@chronicstone/typed-xlsx'

// OPTIONAL : DEFINE SHARED TRANSFORMERS THAT CAN BE USE TO TRANSFORM VALUE INSERTED INTO A CELL
const transformers = {
    boolean: (value: boolean) => value ? 'Yes' : 'No',
    list: (value: (string)[]) => value.join(', '),
    arrayLength: (value: any[]) => value.length,
} satisfies TransformersMap

// Use the schema builder to define your sheet schema
const userExportSchema = ExcelSchemaBuilder
    .create<User>()
    .withTransformers(transformers)
    .column('id', {
        key: 'id',
        summary: [{ value: () => 'TOTAL BEFORE VAT' }, { value: () => 'TOTAL' }],
    })
    .column('firstName', { key: 'firstName' })
    .column('lastName', { key: 'lastName' })
    .column('email', { key: 'email' })
    .column('roles', {
        key: 'roles',
        transform: 'list',
        cellStyle: data => ({ font: { color: { rgb: data.roles.includes('admin') ? 'd10808' : undefined } } }),
    })
    // .column('balance', {
    //     key: 'balance',
    //     format: '"$"#,##0.00_);\\("$"#,##0.00\\)',
    //     summary: [
    //         {
    //             value: data => data.reduce((acc, user) => acc + user.balance, 0),
    //             format: '"$"#,##0.00_);\\("$"#,##0.00\\)',
    //         },
    //         {
    //             value: data => data.reduce((acc, user) => acc + user.balance, 0) * 1.2,
    //             format: '"$"#,##0.00_);\\("$"#,##0.00\\)',
    //         },
    //     ],
    // })
    .column('nbOrgs', { key: 'organizations', transform: 'arrayLength' })
    .column('orgs', { key: 'organizations', transform: org => org.map(org => org.name).join(', ') })
    .column('generalScore', {
        key: 'results.general.overall',
        format: '# / 10',
        summary: [{
            value: data => data.reduce((acc, user) => acc + user.results.general.overall, 0) / data.length,
            format: '# / 10',
        }],
    })
    .column('technicalScore', {
        key: 'results.technical.overall',
        summary: [{
            value: data => data.reduce((acc, user) => acc + user.results.technical.overall, 0) / data.length,
        }],
    })
    .column('interviewScore', { key: 'results.interview.overall', default: 'N/A' })
    // .column('createdAt', { key: 'createdAt', format: 'd mmm yyyy' })
    .group('group:org', (builder, context: Organization[]) => {
        for (const org of context) {
            builder
                .column(`orga-${org.id}`, {
                    label: `User in ${org.name}`,
                    key: 'organizations',
                    transform: orgs => orgs.some(o => o.id === org.id) ? 'YES' : 'NO',
                    cellStyle: data => ({
                        font: {
                            color: { rgb: data.organizations.some(o => o.id === org.id) ? '61eb34' : 'd10808' },
                        },
                    }),
                })
        }
    })
    .build()

export default userExportSchema;