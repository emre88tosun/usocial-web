import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
  Button,
} from '@nextui-org/react';
import { Influencer } from '@customTypes/influencer';
import safeString from '@helpers/safeString';
import { IconDiamond } from '@tabler/icons-react';
import useInfluencersActions from '@hooks/influencer/useInfluencersActions';
import { useToggle } from 'usehooks-ts';
import toast from 'react-hot-toast';
import HTTP_CODES_ENUM from '@constants/http';
import useMe from '@hooks/auth/useMe';

type Props = {
  readonly influencer: Influencer & { chat_unlocked: boolean };
};

export default function InfluencerCard(props: Props) {
  const { data: user } = useMe();
  const { influencer } = props;
  const {
    unlock: { mutateAsync: unlock },
  } = useInfluencersActions();
  const [on, , toggle] = useToggle(false);
  const onUnlock = async () => {
    toggle(true);
    const result = await unlock({ influencer_id: influencer.id });
    toggle(false);
    if (result.status === HTTP_CODES_ENUM.BAD_REQUEST) {
      toast.error(safeString(result.data.message));
      return;
    }
    if (result.status === HTTP_CODES_ENUM.OK) {
      toast.success('You have successfully unlocked this influencer');
    }
  };

  return (
    <Card className="h-max overflow-visible pt-1">
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="min-h-[260px] rounded-xl object-cover"
          src="https://picsum.photos/600/400"
          width={640}
        />
      </CardBody>
      <CardHeader className="flex-col items-start px-4 pb-0 pt-2">
        <h4 className="text-large font-bold">
          {safeString(influencer.user?.name)}
        </h4>
        <small className="text-default-500">{safeString(influencer.bio)}</small>
      </CardHeader>
      {!influencer.chat_unlocked &&
      safeString(user?.role?.name) === 'standard user' ? (
        <CardFooter>
          <Button
            startContent={<IconDiamond />}
            fullWidth
            color="primary"
            variant="solid"
            isLoading={on}
            onClick={onUnlock}
          >
            {`DM Me (${influencer.gem_cost_per_dm} Gems)`}
          </Button>
        </CardFooter>
      ) : (
        <div className="pb-3" />
      )}
    </Card>
  );
}
