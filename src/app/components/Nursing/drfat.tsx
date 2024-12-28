<Card>
      <CardHeader>
        <CardTitle className="flex flex-col gap-3">
          <h2 className="text-3xl font-bold">Trung bình tổng đánh giá</h2>
          <div className="flex items-center gap-3">
            <div className="flex">{renderStars(5)}</div>
            <span className="text-2xl font-bold">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-xl text-gray-500">
              ({testimonials.length})
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-8">
          {testimonials.map((review) => (
            <div key={review.id} className="border-b pb-8 last:border-b-0">
              <div className="flex items-center gap-6 mb-4">
                <Avatar className="w-[100px] h-[100px]">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-3xl">
                      <h3 className=" font-semibold">{review.name}</h3>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-lg text-gray-500">{review.date}</p>
                  </div>
                </div>
              </div>

              <p className="text-2xl mb-3">{review.comment}</p>
              <Badge className="rounded-[50px] bg-[#CCF0F3] text-irisBlueColor text-lg mb-4 hover:bg-[#CCF0F3]">
                {review.service}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>