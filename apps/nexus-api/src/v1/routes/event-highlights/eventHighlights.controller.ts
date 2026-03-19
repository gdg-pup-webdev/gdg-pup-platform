import { Request, Response } from "express";
import { EventHighlightsController } from "../../modules/eventHighlights/EventHighlightsController";

export class EventHighlightsHttpController {
  constructor(private readonly controller: EventHighlightsController) {}

  createHighlight = async (req: Request, res: Response) => {
    try {
      const data = await this.controller.createHighlight(req.body.data);
      res.status(201).json({
        status: "success",
        message: "Event highlight created successfully",
        data,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
  };

  updateHighlight = async (req: Request, res: Response) => {
    try {
      const data = await this.controller.updateHighlight(
        req.params.id,
        req.body.data,
      );
      res.status(200).json({
        status: "success",
        message: "Event highlight updated successfully",
        data,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
  };

  deleteHighlight = async (req: Request, res: Response) => {
    try {
      await this.controller.deleteHighlight(req.params.id);
      res.status(200).json({
        status: "success",
        message: "Event highlight deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
  };

  getOneHighlight = async (req: Request, res: Response) => {
    try {
      const data = await this.controller.getOneHighlight(req.params.id);
      res.status(200).json({
        status: "success",
        message: "Event highlight fetched successfully",
        data,
      });
    } catch (error: any) {
      res.status(404).json({
        status: "fail",
        message: error.message,
      });
    }
  };

  listHighlights = async (req: Request, res: Response) => {
    try {
      const pageNumber = parseInt(req.query.pageNumber as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const eventId = req.query.eventId as string;

      const { list, count } = await this.controller.listHighlights(
        pageNumber,
        pageSize,
        eventId,
      );

      res.status(200).json({
        status: "success",
        message: "Event highlights fetched successfully",
        data: list,
        meta: {
          totalRecords: count,
          pageSize,
          currentPage: pageNumber,
          totalPages: Math.ceil(count / pageSize),
        },
      });
    } catch (error: any) {
      res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
  };
}
