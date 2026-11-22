import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Project } from "@/models/Project";
import { GalleryImage } from "@/models/GalleryImage";
import { ContactEnquiry } from "@/models/ContactEnquiry";
import { calculateDeliveryStatus } from "@/lib/project-utils";

export async function GET() {
  try {
    await connectToDatabase();

    const [
      totalCompletedProjects,
      totalOngoingProjects,
      totalGalleryImages,
      totalEnquiries,
      newEnquiriesCount,
      completedProjects,
      recentProjects,
      latestEnquiries,
    ] = await Promise.all([
      Project.countDocuments({ status: "completed" }),
      Project.countDocuments({ status: "ongoing" }),
      GalleryImage.countDocuments(),
      ContactEnquiry.countDocuments(),
      ContactEnquiry.countDocuments({ status: "new" }),
      Project.find({ status: "completed", actualCompletionDate: { $exists: true } }).lean(),
      Project.find().sort({ createdAt: -1 }).limit(5).lean(),
      ContactEnquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    // Calculate delivery metrics from completed projects
    let earlyDeliveryCount = 0;
    let onTimeDeliveryCount = 0;
    let delayedDeliveryCount = 0;

    for (const proj of completedProjects) {
      if (proj.expectedCompletionDate && proj.actualCompletionDate) {
        const status = calculateDeliveryStatus(
          proj.expectedCompletionDate,
          proj.actualCompletionDate
        );
        if (status === "Early") earlyDeliveryCount++;
        else if (status === "On Time") onTimeDeliveryCount++;
        else if (status === "Delayed") delayedDeliveryCount++;
      }
    }

    const totalEvaluated = earlyDeliveryCount + onTimeDeliveryCount + delayedDeliveryCount;
    const onTimeDeliveryPercentage =
      totalEvaluated > 0
        ? Math.round(((earlyDeliveryCount + onTimeDeliveryCount) / totalEvaluated) * 100)
        : 100;

    return NextResponse.json({
      success: true,
      stats: {
        totalCompletedProjects,
        totalOngoingProjects,
        totalGalleryImages,
        totalEnquiries,
        newEnquiriesCount,
        onTimeDeliveryPercentage,
        earlyDeliveryCount,
        onTimeDeliveryCount,
        delayedDeliveryCount,
        recentProjects,
        latestEnquiries,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to compile dashboard metrics",
      },
      { status: 500 }
    );
  }
}
