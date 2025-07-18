"use client";

import Header from "@/app/common/header";
import CreateOrganizationPage from "@/sections/create-organization/create-organization";

const Page = () => {
  return (
    <div className="bg-muted/40 min-h-screen pb-12">
      <Header
        links={[
          { name: "Dashboard", href: "/super-admin" },
          { name: "Organizations", href: "" },
        ]}
      />

      <CreateOrganizationPage id="1" />
      {/* <div className=" md:max-w-5xl w-full md:!mx-auto">
        <Card className="shadow-xl rounded-2xl   dark:bg-[#171717]">
          <CardContent
            className=" min-h-[86vh]   p-0
                     "
          >
            <CardHeader>
              <h2 className="md:text-2xl text-xl font-bold mb-6 text-foreground">
                {!isEdit ? "Create Organization" : "Edit Organization"}
              </h2>

              <FormProvider
                methods={methods}
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <div className="overflow-x-auto whitespace-nowrap scrollbar-hide px-1 block ">
                    <TabsList className="flex md:items-center gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border rounded-full p-1 min-w-max">
                      {tabOptions.map((tab, index) => (
                        <TabsTrigger
                          key={index}
                          value={tab.value}
                          className={cn(
                            "text-sm md:text-md font-semibold rounded-full px-4 py-2 transition-colors cursor-pointer"
                          )}
                        >
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                </Tabs>

                <div className="mt-6 w-full border-black">
                  {activeTab === "basicInfo" && (
                    <div className="flex flex-col gap-6">
                      <RHFUploadAvatar name="image" label="Organization Logo" />
                      <RHFTextField
                        name="name"
                        label="Organization Name"
                        placeholder="Enter Organization Name"
                        className={`w-full h-[40px] ${
                          methods.formState.errors.name ? "border-red-400" : ""
                        }`}
                      />
                      <div className="grid md:grid-cols-2 gap-4">
                        <RHFSelectField
                          name="venueType"
                          label="Venue Type"
                          placeholder="Select Venue Type"
                          options={[
                            { label: "Indoor", value: "indoor" },
                            { label: "Outdoor", value: "outdoor" },
                            { label: "Virtual", value: "virtual" },
                          ]}
                        />
                        <RHFSelectField
                          name="category"
                          label="Category"
                          placeholder="Select Category"
                          options={[
                            { label: "Education", value: "education" },
                            { label: "Health", value: "health" },
                            { label: "Technology", value: "technology" },
                          ]}
                        />
                        <RHFSelectField
                          name="tag"
                          label="Tag"
                          placeholder="Select Tag"
                          options={[
                            { label: "Popular", value: "popular" },
                            { label: "New", value: "new" },
                            { label: "Featured", value: "featured" },
                          ]}
                        />
                        <RHFTextField
                          name="workingHours"
                          label="Working Hours"
                          placeholder="Enter Working Hours"
                        />
                      </div>
                      <RHFMultiImageUpload
                        name="photoGallery"
                        label="Photo Gallery"
                      />
                      <RHFTextField
                        name="description"
                        label="Description"
                        placeholder="Enter Description"
                        multiline
                        rows={4}
                      />
                    </div>
                  )}

                  {activeTab === "socialLinks" && (
                    <div className="flex flex-col gap-4 mt-4">
                      <RHFTextField
                        name="instagram"
                        label="Instagram Link"
                        placeholder="Enter Instagram Link"
                      />
                      <RHFTextField
                        name="facebook"
                        label="Facebook Link"
                        placeholder="Enter Facebook Link"
                      />
                      <RHFTextField
                        name="youtube"
                        label="YouTube Link"
                        placeholder="Enter YouTube Link"
                      />
                      <RHFTextField
                        name="linkedin"
                        label="LinkedIn Link"
                        placeholder="Enter LinkedIn Link"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-6 items-center gap-3">
                  {activeTab !== "basicInfo" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (activeTab === "socialLinks")
                          setActiveTab("basicInfo");
                      }}
                    >
                      Back
                    </Button>
                  )}
                  {activeTab !== "socialLinks" && (
                    <Button
                      type="button"
                      className="bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
                      onClick={handleNextTab}
                    >
                      Next
                    </Button>
                  )}
                  {activeTab === "socialLinks" && (
                    <Button
                      type="submit"
                      className="bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
                    >
                      {!isEdit ? "Add Organization" : "Update Organization"}
                    </Button>
                  )}
                </div>
              </FormProvider>
            </CardHeader>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
};

export default Page;
