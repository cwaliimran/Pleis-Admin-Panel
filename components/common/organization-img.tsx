import Image from "next/image"

export default function OrgInfo({ organizationData }: any) {
  return (
    <>
      {/* First Image */}
      {organizationData?.otherInfo?.galleryMediaInfo?.slice(0, 1).map((image: any, index: number) => (
        <div key={index} className="relative h-[200px] w-full rounded-2xl md:h-[300px]">
          <Image
            title="Gallery Image"
            src={image?.url || ""}
            alt="Gallery Image"
            fill={true}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-2xl object-cover"
          />
        </div>
      ))}

      {/* Gallery Grid */}
      <div className="grid w-full grid-cols-12 gap-2">
        {organizationData?.otherInfo?.galleryMediaInfo?.slice(1).map((image: any, index: number) => (
          <div key={index} className="relative col-span-6 h-[100px] md:col-span-3 md:h-[140px]">
            <Image
              src={image?.url || ""}
              alt={`Gallery Image ${index + 2}`}
              fill={true}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="cursor-pointer rounded-lg object-cover"
            />
          </div>
        ))}
      </div>
    </>
  )
}
