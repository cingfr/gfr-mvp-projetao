import { Request, Response } from 'express'
import { Case, CaseSchema } from '../../common/case'
import { nanoid } from 'nanoid'
import { CaseModel } from '../model/case/model'
import { z } from 'zod'

export async function CreateCase(request: Request, response: Response) {
    const schema = CaseSchema.omit({ id: true })
    const id = nanoid()

    const parsedCase = schema.safeParse(request.body)

    if (parsedCase.success) {
        const tempCase: Case = {
            id,
            ...request.body,
            processes: JSON.stringify(request.body.processes),
        }

        await CaseModel.create(tempCase)
            .then(() => {
                response.status(201).send({ id })
            })
            .catch((e) => {
                response.status(500).send(e)
            })
    } else {
        response.status(400).send(parsedCase.error)
    }
}

export async function GetCase(request: Request, response: Response) {
    const parsedGet = z.object({ id: z.string() }).safeParse(request.query)

    if (parsedGet.success) {
        await CaseModel.findByPk((request.query as { id: string }).id)
            .then((cases) => {
                if (cases === null) {
                    response.status(404).send()
                    return
                }

                response.status(200).send(cases)
            })
            .catch((e) => {
                response.status(500).send(e)
            })
    } else {
        response.status(400).send(parsedGet.error)
    }
}

export async function GetAllCases(request: Request, response: Response) {
    await CaseModel.findAll()
        .then((res) => {
            let patients: Case[] = []

            for (let i = 0; i < res.length; i++) {
                patients.push(res[i].dataValues)
            }

            response.status(200).send(patients)
        })
        .catch((e) => {
            response.status(500).send(e)
        })
}

export async function UpdateCase(request: Request, response: Response) {
    const parsedCase = CaseSchema.safeParse(request.body)

    if (parsedCase.success) {
        const parsedBody = request.body as Case

        const result = await CaseModel.update({ ...parsedBody, processes: JSON.stringify(parsedBody.processes) }, { where: { id: parsedBody.id } })

        if (result[0] === 0) {
            response.status(404).send()
            return
        }

        response.status(200).send()
    } else {
        response.status(400).send(parsedCase.error)
    }

    return
}

export async function DeleteCase(request: Request, response: Response) {
    const parsedGet = z.object({ id: z.string() }).safeParse(request.body)

    if (parsedGet.success) {
        await CaseModel.destroy({
            where: {
                id: request.body.id,
            },
        })
            .then((rowsAffected) => {
                if (rowsAffected === 0) {
                    response.status(404).send()
                } else {
                    response.status(200).send()
                }
            })
            .catch((e) => {
                response.status(500).send(e)
            })
    } else {
        response.status(400).send(parsedGet.error)
    }
}
